const { promiseController } = require('../utils');
const service = require('./service');
const userService = require('../users/service');

const getProjectsByOwner = promiseController(async (req) => {
  await userService.get(req.params.ownerId);
  const projects = await service.getProjectsByOwner(req.params.ownerId);

  return {
    status: 200,
    message: 'Projects fetched successfully',
    data: projects
  };
});

const create = promiseController(async (req) => {
  const project = await service.create(req.body);

  return {
    status: 201,
    message: 'Project created successfully',
    data: project
  };
});

module.exports = {
  getProjectsByOwner,
  create
};
