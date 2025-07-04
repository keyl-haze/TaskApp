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

const get = promiseController(async (req) => {
  const project = await service.get(req.params.id);
  if (!project) {
    return {
      status: 404,
      message: 'Project not found'
    };
  }
  return {
    status: 200,
    message: 'Project fetched successfully',
    data: project
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

const assignMultipleUsersToProject = promiseController(async (req) => {
  const { projectId } = req.params;
  const { userIds } = req.body;
  const result = await service.assignMultipleUsersToProject(projectId, userIds);
  return {
    status: 201,
    message: 'Users assigned to project successfully',
    data: result
  };
});

const removeUserFromProject = promiseController(async (req) => {
  const { projectId, userId } = req.params;
  const result = await service.removeUserFromProject(projectId, userId);
  return {
    status: 200,
    message: 'User removed from project successfully',
    data: result
  };
});

const listProjectsOfUser = promiseController(async (req) => {
  const { userId } = req.params;
  const projects = await service.listProjectsOfUser(userId);
  return {
    status: 200,
    message: 'Projects fetched successfully',
    data: projects
  };
});

const listMembersOfProject = promiseController(async (req) => {
  const { projectId } = req.params;
  const members = await service.listMembersByProject(projectId);
  return {
    status: 200,
    message: 'Project members fetched successfully',
    data: members
  };
});

const update = promiseController(async (req) => {
  const mode = req.updateMode || 'patch';
  const project = await service.update(req.params.id, req.body, mode);

  return {
    status: 200,
    message: 'Project updated successfully',
    data: project
  };
});

const softDelete = promiseController(async (req) => {
  const { id } = req.params;
  await service.softDelete(id);
  return {
    status: 204,
    message: 'Project deleted successfully'
  };
});

const removeMultipleUsersFromProject = promiseController(async (req) => {
  const { projectId } = req.params;
  const { userIds } = req.body;
  const result = await service.removeMultipleUsersFromProject(
    projectId,
    userIds
  );
  return {
    status: 200,
    message: 'Users removed from project successfully',
    data: result
  };
});

const restore = promiseController(async (req) => {
  const { id } = req.params;
  const project = await service.restore(id);
  return {
    status: 200,
    message: 'Project restored successfully',
    data: project
  };
});

module.exports = {
  create,
  list,
  get,
  getByOwner,
  assignUserToProject,
  assignMultipleUsersToProject,
  removeUserFromProject,
  listProjectsOfUser,
  listMembersOfProject,
  update,
  softDelete,
  removeMultipleUsersFromProject,
  restore
};
