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

module.exports = {
  create
};