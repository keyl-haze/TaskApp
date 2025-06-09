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

const list = promiseController(async (req) => {
  const projects = await service.list(req.query);
  return {
    status: 200,
    message: 'Projects fetched successfully',
    data: projects
  };
});

module.exports = {
  create,
  list
};