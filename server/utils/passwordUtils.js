const bcrypt = require('bcrypt');

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

module.exports = { hashPassword, comparePassword };
