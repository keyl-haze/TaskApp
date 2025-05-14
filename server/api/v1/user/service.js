const { buildWhereFilter } = require('../utils/queries');

const { User } = require(`${__serverRoot}/models`);

const _validQueryProps = [
  'id',
  'name',
  'firstName',
  'lastName',
  'email',
  'username',
  'role',
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

module.exports = {
  list
};
