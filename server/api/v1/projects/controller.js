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

const assignUserToProject = promiseController(async (req) => {
  await userService.get(req.params.userId);
  const projectUser = await service.assignUserToProject(req.params);

  return {
    status: 200,
    message: 'ProjectUser created successfully',
    data: projectUser
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
  assignUserToProject,
  getProjectsByOwner,
  create
};
