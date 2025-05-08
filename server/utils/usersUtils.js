const { User } = require('../models');

/**
 *
 * @param {string} email
 * @returns {Promise<boolean>} - Returns true if user exists, false  if otherwise
 */
async function doesUserExist(email) {
  const existingUser = await User.findOne({ where: { email } });
  return !!existingUser;
}

module.exports = {
  doesUserExist
};
