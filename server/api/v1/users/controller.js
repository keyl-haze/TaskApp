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
  const mode = req.updateMode || 'patch';
  const user = await service.update(req.params.id, req.body, mode);

  return {
    status: 200,
    message: 'User updated successfully',
    data: user
  };
});

const remove = promiseController(async (req) => {
  const user = await service.softDelete(req.params.id);

  return {
    status: 200,
    message: 'User deleted successfully',
    data: user
  };
});

const restore = promiseController(async (req) => {
  const user = await service.restore(req.params.id);

  return {
    status: 200,
    message: 'User restored successfully',
    data: user
  };
});


const listUserProjects = promiseController(async (req) => {
  const userProjects = await service.listUserProjects(req.params.id);

  return {
    status: 200,
    message: 'Users Projects fetched successfully',
    data: userProjects
  };
});

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  restore,
  listUserProjects
};
