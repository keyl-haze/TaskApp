const { Op, Sequelize } = require('sequelize');

const userWhereFilter = (validQueryProps, query = {}) => {
  const fields = Object.keys(query);
  let where = {};

  // Global search support for users
  if (query.search && typeof query.search === 'string' && query.search.trim()) {
    const value = `%${query.search.trim()}%`;
    where = {
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn(
            'concat',
            Sequelize.col('firstName'),
            ' ',
            Sequelize.col('lastName')
          ),
          { [Op.iLike]: value }
        ),
        { email: { [Op.iLike]: value } },
        { username: { [Op.iLike]: value } },
        Sequelize.where(
          Sequelize.cast(Sequelize.col('role'), 'text'),
          { [Op.iLike]: value }
        )
      ]
    };
    return where;
  }

  if (fields.length) {
    const orFilters = [];
    const andFilters = [];

    fields.forEach((fieldName) => {
      if (validQueryProps.includes(fieldName)) {
        const field = query[fieldName];
        if (field.iLike) {
          // Cast enum fields to text for ILIKE
          if (fieldName === 'role') {
            orFilters.push(
              Sequelize.where(
                Sequelize.cast(Sequelize.col(fieldName), 'text'),
                { [Op.iLike]: `%${field.iLike}%` }
              )
            );
          } else {
            orFilters.push({
              [fieldName]: {
                [Op.iLike]: `%${field.iLike}%`
              }
            });
          }
        } else if (field.or) {
          const values = field.or.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.or]: values
            }
          });
        } else if (field.eq) {
          const value = field.eq;
          andFilters.push({
            [fieldName]: {
              [Op.eq]: value
            }
          });
        } else if (field.ne) {
          const value = field.ne;
          andFilters.push({
            [fieldName]: {
              [Op.ne]: value
            }
          });
        } else if (field.in) {
          const values = field.or.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.in]: values
            }
          });
        } else if (field.contains) {
          const values = field.contains.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.contains]: values
            }
          });
        } else if (field.overlap) {
          const values = field.overlap.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.overlap]: values
            }
          });
        } else if (field.between) {
          const values = field.between.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.between]: values
            }
          });
        } else {
          andFilters.push({
            [fieldName]: field
          });
        }
      }
    });

    if (orFilters.length > 0) {
      where = andFilters.length > 0
        ? { [Op.and]: [...andFilters, { [Op.or]: orFilters }] }
        : { [Op.or]: orFilters };
    } else if (andFilters.length > 0) {
      where = { [Op.and]: andFilters };
    }
  }
  return where;
};

const taskWhereFilter = (validQueryProps, query = {}) => {
  const fields = Object.keys(query);
  let where = {};
  
  if (fields.length) {
    const orFilters = [];
    const andFilters = [];

    fields.forEach((fieldName) => {
      if (validQueryProps.includes(fieldName)) {
        const field = query[fieldName];
        if (field.iLike) {
          // Cast enum fields to text for ILIKE
          if (['type', 'priority'].includes(fieldName)) {
            orFilters.push(
              Sequelize.where(
                Sequelize.cast(Sequelize.col(fieldName), 'text'),
                { [Op.iLike]: `%${field.iLike}%` }
              )
            );
          } else {
            orFilters.push({
              [fieldName]: {
                [Op.iLike]: `%${field.iLike}%`
              }
            });
          }
        } else if (field.or) {
          const values = field.or.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.or]: values
            }
          });
        } else if (field.eq) {
          const value = field.eq;
          andFilters.push({
            [fieldName]: {
              [Op.eq]: value
            }
          });
        } else if (field.ne) {
          const value = field.ne;
          andFilters.push({
            [fieldName]: {
              [Op.ne]: value
            }
          });
        } else if (field.in) {
          const values = field.or.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.in]: values
            }
          });
        } else if (field.contains) {
          const values = field.contains.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.contains]: values
            }
          });
        } else if (field.overlap) {
          const values = field.overlap.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.overlap]: values
            }
          });
        } else if (field.between) {
          const values = field.between.split(',');
          andFilters.push({
            [fieldName]: {
              [Op.between]: values
            }
          });
        } else {
          andFilters.push({
            [fieldName]: field
          });
        }
      }
    });

    if (orFilters.length > 0) {
      where = andFilters.length > 0
        ? { [Op.and]: [...andFilters, { [Op.or]: orFilters }] }
        : { [Op.or]: orFilters };
    } else if (andFilters.length > 0) {
      where = { [Op.and]: andFilters };
    }
  }
  return where;
}

module.exports = {
  userWhereFilter,
  taskWhereFilter
};
