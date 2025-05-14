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

const list = async (query) => {
  const { ...otherQuery } = query;
  const where = buildWhereFilter(
    _validQueryProps,
    otherQuery.filter,
    User.name
  );
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    where
  });
  return users;
};

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
  create
};
