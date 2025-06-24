const { User } = require(`${__serverRoot}/models`);
const { comparePassword } = require('../utils/account');

const login = async ({ email, password }) => {
  if (!email) {
    const error = new Error('Email is required');
    error.status = 400;
    throw error;
  }
  if (!password) {
    const error = new Error('Password is required');
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({
    where: { email },
    attributes: { include: ['password'] }
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  if (!user.password) {
    const error = new Error('User has no password set');
    error.status = 500;
    throw error;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role
  };
};

module.exports = { login };