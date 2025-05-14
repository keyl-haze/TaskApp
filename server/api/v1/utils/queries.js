const { Op, Sequelize } = require('sequelize');

const buildWhereFilter = (validQueryProps, query, modelName = '') => {
  const fields = Object.keys(query);
  let where = {};
  if (fields.length) {
    const whereAnd = [];
    fields.map((fieldName) => {
      if (validQueryProps.includes(fieldName)) {
        const field = query[fieldName];
        if (fieldName === 'name' && modelName === 'User' && field.iLike) {
          const value = field.iLike;
          whereAnd.push({
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  'concat',
                  Sequelize.col('firstName'),
                  ' ',
                  Sequelize.col('lastName')
                ),
                {
                  [Op.iLike]: `%${value}%`
                }
              )
            ]
          });
        } else if (field.or) {
          const values = field.or.split(',');
          whereAnd.push({
            [fieldName]: {
              [Op.or]: values
            }
          });
        } else if (field.eq) {
          const value = field.eq;
          whereAnd.push({
            [fieldName]: {
              [Op.eq]: value
            }
          });
        } else if (field.ne) {
          const value = field.ne;
          whereAnd.push({
            [fieldName]: {
              [Op.ne]: value
            }
          });
        } else if (field.iLike) {
          const value = field.iLike;
          whereAnd.push({
            [fieldName]: {
              [Op.iLike]: `%${value}%`
            }
          });
        } else if (field.in) {
          const values = field.or.split(',');
          whereAnd.push({
            [fieldName]: {
              [Op.in]: values
            }
          });
        } else if (field.contains) {
          const values = field.contains.split(',');
          whereAnd.push({
            [fieldName]: {
              [Op.contains]: values
            }
          });
        } else if (field.overlap) {
          const values = field.overlap.split(',');
          whereAnd.push({
            [fieldName]: {
              [Op.overlap]: values
            }
          });
        } else if (field.between) {
          const values = field.between.split(',');
          whereAnd.push({
            [fieldName]: {
              [Op.between]: values
            }
          });
        } else {
          whereAnd.push({
            [fieldName]: field
          });
        }
      }
    });
    where = {
      [Op.and]: whereAnd
    };
  }

  return where;
};

module.exports = {
  buildWhereFilter
};
