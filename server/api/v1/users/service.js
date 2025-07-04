const { userWhereFilter, buildOrder } = require('../utils/queries');
const { Op } = require('sequelize');
const {
  doesEmailExist,
  doesUsernameExist,
  hashPassword,
  isUsernameValid
} = require('../utils/account');
const { sequelize } = require('../../../models');
const { User, Project, ProjectUser } = require(`${__serverRoot}/models`);
const _validQueryProps = [
  'id',
  'name',
  'firstName',
  'lastName',
  'email',
  'username',
  'role'
];
const orderTypes = {
  id: 'STRING',
  name: 'STRING',
  firstName: 'STRING',
  lastName: 'STRING',
  email: 'STRING',
  username: 'STRING',
  role: 'ENUM',
  deletedAt: 'TIMESTAMP',
  createdAt: 'TIMESTAMP',
  updatedAt: 'TIMESTAMP'
};

const list = async (query) => {
  const { deleted, all, search, ...otherQuery } = query;

  if (search && typeof search === 'string' && search.trim()) {
    if (!otherQuery.filter) otherQuery.filter = {};
    otherQuery.filter.search = search.trim();
  }

  const where = userWhereFilter(_validQueryProps, otherQuery.filter, User.name);
  const order = query.order || ['email'];
  const orderQuery = sequelize.literal(buildOrder({}, order, orderTypes));

  let findOptions = { where, order: orderQuery };

  if (all === 'true') {
    // Return all users, including soft-deleted
    findOptions.paranoid = false;
  } else if (deleted === 'true') {
    // Only soft-deleted users
    findOptions.paranoid = false;
    findOptions.where.deletedAt = { [Op.not]: null };
  }

  const users = await User.findAll(findOptions);
  // TODO order: [['column', 'ASC or DESC']],
  return users;
};

const get = async (id, options = {}) => {
  if (!/^\d+$/.test(id)) {
    const error = new Error();
    error.name = 'InvalidIdError';
    error.status = 400;
    error.message = 'User not found';
    error.details = {
      id
    };
    throw error;
  }
  const user = await User.findByPk(id, options);
  if (!user) {
    const error = new Error();
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User not found';
    error.details = {
      id
    };
    throw error;
  }
  return user;
};

const create = async (user) => {
  const { username, firstName, middleName, lastName, role, email, password } =
    user;

  const emailExists = await doesEmailExist(email);
  if (emailExists) {
    const error = new Error();
    error.name = 'EmailExistsError';
    error.status = 400;
    error.message = 'Client already exists';
    throw error;
  }

  const usernameExists = await doesUsernameExist(username);
  if (usernameExists) {
    const error = new Error();
    error.name = 'UsernameExistsError';
    error.status = 400;
    error.message = 'Client already exists';
    throw error;
  }

  const usernameValid = await isUsernameValid(username);
  if (!usernameValid) {
    const error = new Error();
    error.name = 'InvalidUsernameError';
    error.status = 400;
    error.message = 'Username is invalid';
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    username,
    firstName,
    middleName,
    lastName,
    role,
    email,
    password: hashedPassword
  });
  return newUser;
};

const update = async (id, updates, mode = 'patch') => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error();
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User not found';
    error.details = { id };
    throw error;
  }

  const allowedFields = [
    'username',
    'firstName',
    'middleName',
    'lastName',
    'role',
    'email'
    // TODO: allow update password, eventually
  ];

  // * Check if PUT or PATCH request
  let filteredUpdates = {};

  if (mode === 'PUT') {
    for (const field of allowedFields) {
      filteredUpdates[field] = updates.hasOwnProperty(field)
        ? updates[field]
        : null;
    }
  } else {
    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field) && updates[field] !== null) {
        filteredUpdates[field] = updates[field];
      }
    }
  }

  if (filteredUpdates.email && filteredUpdates.email !== user.email) {
    const emailExists = await doesEmailExist(filteredUpdates.email);
    if (emailExists) {
      const error = new Error();
      error.name = 'EmailExistsError';
      error.status = 400;
      error.message = 'Invalid change';
      throw error;
    }
  }
  if (filteredUpdates.username && filteredUpdates.username !== user.username) {
    const usernameExists = await doesUsernameExist(filteredUpdates.username);
    if (usernameExists) {
      const error = new Error();
      error.name = 'UsernameExistsError';
      error.status = 400;
      error.message = 'Invalid change';
      throw error;
    }
    const usernameValid = await isUsernameValid(filteredUpdates.username);
    if (!usernameValid) {
      const error = new Error();
      error.name = 'InvalidUsernameError';
      error.status = 400;
      error.message = 'Username is invalid';
      throw error;
    }
  }

  await user.update(filteredUpdates);
  return user;
};

const softDelete = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error();
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User does not exist';
    error.details = { id };
    throw error;
  }
  await user.destroy();
  return user;
};

const restore = async (id) => {
  const user = await User.findByPk(id, { paranoid: false });
  if (!user) {
    const error = new Error();
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User does not exist';
    error.details = { id };
    throw error;
  }

  if (!user.deletedAt) {
    const error = new Error();
    error.name = 'UserNotSoftDeletedError';
    error.status = 400;
    error.message = 'Restore request is invalid';
    error.details = { id };
    throw error;
  }

  await user.restore();
  return user;
};

const listUserProjects = async (userId) => {
  await get(userId);
  const userProjects = await Project.findAll({
    include: [
      {
        model: User,
        through: ProjectUser,
        where: { id: userId },
        attributes: []
      }
    ]
  });
  return userProjects;
};

module.exports = {
  list,
  get,
  create,
  update,
  softDelete,
  restore,
  listUserProjects
};
