const { promiseController } = require('../utils');
const service = require('./service');

const list = promiseController(async (req) => {
  const users = await service.list(req.query);

  return {
    status: 200,
    message: 'Users fetched successfully',
    data: users
  };
});

const get = promiseController(async (req) => {
  const user = await service.get(req.params.id);

  return {
    status: 200,
    message: 'User fetched successfully',
    data: user
  };
});

const create = promiseController(async (req) => {
  const user = await service.create(req.body);

  return {
    status: 201,
    message: 'User created successfully',
    data: user
  };
});

const update = promiseController(async (req) => {
  const user = await service.update(req.params.id, req.body);

  return {
    status: 200,
    message: 'User updated successfully',
    data: user
  };
});

module.exports = {
  list,
  get,
  create,
  update
};
