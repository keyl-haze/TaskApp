const { buildWhereFilter } = require('../utils/queries');
const {
  doesEmailExist,
  doesUsernameExist,
  hashPassword,
  isUsernameValid
} = require('../utils/account');
const { User } = require(`${__serverRoot}/models`);
const _validQueryProps = [
  'id',
  'name',
  'firstName',
  'lastName',
  'email',
  'username',
  'role'
];

// * List users
const list = async (query) => {
  const { ...otherQuery } = query;
  const where = buildWhereFilter(
    _validQueryProps,
    otherQuery.filter,
    User.name
  );
  const users = await User.findAll({
    where
    // TODO order: [['column', 'ASC or DESC']],
  });
  return users;
};

// * Get user by id
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

// * Create user
const create = async (user) => {
  const { username, firstName, middleName, lastName, role, email, password } =
    user;

  // * Check if email already exists
  const emailExists = await doesEmailExist(email);
  if (emailExists) {
    const error = new Error();
    error.name = 'EmailExistsError';
    error.status = 400;
    error.message = 'Client already exists';
    throw error;
  }

  // * Check if username already exists
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

  // * Hash password
  const hashedPassword = await hashPassword(password);

  // * Create new user
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

// * Update user
const update = async (id, updates, mode = 'patch') => {
  // * Check if user exists
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error();
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User not found';
    error.details = { id };
    throw error;
  }

  // * Allowed fields to update
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
    //  * PUT request: all fields must be present or set to NULL
    for (const field of allowedFields) {
      filteredUpdates[field] = updates.hasOwnProperty(field)
        ? updates[field]
        : null;
    }
  } else {
    // * PATCH request: only update fields that are provided
    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field) && updates[field] !== null) {
        filteredUpdates[field] = updates[field];
      }
    }
  }

  // * Disallow updating username or email to an already existing one
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

  // * Update user only with filtered fields
  await user.update(filteredUpdates);
  return user;
};

module.exports = {
  list,
  get,
  create,
  update
};
