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

const getByOwner = promiseController(async (req) => {
  const projects = await service.getByOwner(req.params.owner);
  return {
    status: 200,
    message: 'Projects fetched successfully',
    data: projects
  };
});

const assignUserToProject = promiseController(async (req) => {
  const { projectId, userId } = req.params;
  const projectUser = await service.assignUserToProject(projectId, userId);
  return {
    status: 201,
    message: 'User assigned to project successfully',
    data: projectUser
  };
});

const listProjectsByUser = promiseController(async (req) => {
  const { userId } = req.params;
  const projects = await service.listProjectsByUser(userId);
  return {
    status: 200,
    message: 'Projects fetched successfully',
    data: projects
  };
});

module.exports = {
  create,
  list,
  getByOwner,
  assignUserToProject,
  listProjectsByUser
};