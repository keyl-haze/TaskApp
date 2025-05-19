const bcrypt = require('bcrypt');
const { User } = require(`${__serverRoot}/models`);

/**
 * Hashes a plaintext password with bcrypt.
 * @param {string} password - Plaintext password.
 * @returns {Promise<string>} Hashed password.
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares a plaintext password with a hashed password.
 * @param {string} password - Plaintext password.
 * @param {string} hashedPassword - Hashed password from DB.
 * @returns {Promise<boolean>} True if passwords match.
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 *
 * @param {string} email
 * @returns {Promise<boolean>} - Returns true if email exists for another user, false  if otherwise
 */
async function doesEmailExist(email) {
  const existingEmail = await User.findOne({ where: { email } });
  return !!existingEmail;
}

/**
 * @param {string} username
 * @returns {Promise<boolean>} - Returns true if username exists for another user, false  if otherwise
 */
async function doesUsernameExist(username) {
  const existingUsername = await User.findOne({ where: { username } });
  return !!existingUsername;
}

/**
 * @param {string} username
 * @returns {Promise<boolean>} - Returns true if username is valid, false  if otherwise
 */
async function isUsernameValid(username) {
  if (typeof username !== 'string') return false;

  const regex = /^[A-Za-z0-9_]{5,}$/; // * Allow letters, numbers, and underscores only for username

  return regex.test(username);
}

module.exports = {
  hashPassword,
  comparePassword,
  doesEmailExist,
  doesUsernameExist,
  isUsernameValid
};
