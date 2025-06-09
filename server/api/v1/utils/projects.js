/**
 * Generic utility to get a record by any field from a Sequelize model.
 * @param {Model} Model - The Sequelize model
 * @param {string} field - The field name
 * @param {any} value - The value to search for
 * @returns {Promise<Model|null>}
 */
const getByField = async (Model, field, value) => {
  if (!Model || !field || typeof value === 'undefined') {
    throw new Error('getByField: Model, field, and value are required');
  }
  const where = {};
  where[field] = value;
  return await Model.findOne({ where });
};

module.exports = { getByField };