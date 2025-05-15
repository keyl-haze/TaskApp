const { buildWhereFilter } = require('../utils/queries');
const { doesEmailExist, doesUsernameExist, hashPassword } = require('../utils/account');
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
  });
  return users;
};

// * Get user by id
const get = async (id, options = {}) => {
  const user = await User.findByPk(id, options);
  if (!user) {
    const error = new Error();
    error.name = 'UserNotFoundError';
    throw error;
  }
  return user;
}

// * Create user
const create = async (user) => {
  const { username, firstName, middleName, lastName, role, email, password } =
    user;

  // * Check if email or username already exists
  const emailExists = await doesEmailExist(email);
  if (emailExists) {
    throw new Error('Email already exists');
  }

  // * Check if username already exists
  const usernameExists = await doesUsernameExist(username);
  if (usernameExists) {
    throw new Error('Username already exists');
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

module.exports = {
  list,
  get,
  create
};
