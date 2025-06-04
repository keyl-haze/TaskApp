const { promiseController } = require('../utils');
const service = require('./service');

const create = promiseController(async (req) => {
  const project = await service.create(req.body);

  return {
    status: 201,
    message: 'Project created successfully',
    data: project
  };
});

module.exports = {
  create,
};
