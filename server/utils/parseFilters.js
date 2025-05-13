const { Op } = require('sequelize');

function parseFilters(query) {
  // * for when then query has "filter" and it is an object
  if (typeof query.filter === 'object' && query.filter !== null) {
    return query.filter;
  }

  const filters = {};

  Object.keys(query).forEach((key) => {
    const match = key.match(/^filter\[(.+?)\]/);
    if (match) {
      const field = match[1];
      filters[field] = query[key];
    }
  });

  return filters;
}

/**
 * @param {Object} filters - The filters object to be parsed.
 * @returns {Object} - Where clause for Sequelize.
 */
function userWhereClause(filters) {
  const where = {};

  Object.keys(filters).forEach((key) => {
    const value = filters[key];

    if (key === 'role') {
      where.role = value;
    } else {
      where[key] = { [Op.iLike]: `%${value}%` };
    }
  });

  return where;
}

module.exports = { parseFilters, userWhereClause };
