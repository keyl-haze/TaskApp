const { promiseController } = require('../utils');
const service = require('./service');

const create = promiseController(async (req) => {
  const task = await service.create(req.body);

  return {
    status: 201,
    message: 'Tasks created successfully',
    data: task
  };
});

const list = promiseController(async (req) => {
  const tasks = await service.list(req.query);

  return {
    status: 200,
    message: 'Tasks fetched successfully',
    data: tasks
  };
});

const get = promiseController(async (req) => {
  const task = await service.get(req.params.id);

  return {
    status: 200,
    message: 'Task fetched successfully',
    data: task
  };
});

const update = promiseController(async (req) => {
  const mode = req.updateMode || 'patch';
  const task = await service.update(req.params.id, req.body, mode);

  return {
    status: 200,
    message: 'Task updated successfully',
    data: task
  };
});

const remove = promiseController(async (req) => {
  const task = await service.softDelete(req.params.id);

  return {
    status: 200,
    message: 'Task deleted successfully',
    data: task
  };
});

const restore = promiseController(async (req) => {
  const task = await service.restore(req.params.id);

  return {
    status: 200,
    message: 'Task restored successfully',
    data: task
  };
});

module.exports = {
  create,
  list,
  get,
  update,
  remove,
  restore
};
