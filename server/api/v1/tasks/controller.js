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

module.exports = {
  create,
  list,
  get
};
