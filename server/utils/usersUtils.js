const { User } = require('../models');

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

module.exports = {
  doesEmailExist,
  doesUsernameExist
};