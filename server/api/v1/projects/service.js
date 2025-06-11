const { Project, ProjectUser, User } = require(`${__serverRoot}/models`);
const { buildOrder } = require('../utils/queries');
const {
  doesProjectTitleExist,
  doesProjectCodeExist,
  doesProjectExist,
  doesUserExist,
  isUserAssignedToProject
} = require('../utils/projects');

const _validQueryProps = [
  'id',
  'title',
  'owner',
  'code',
  'description',
  'start',
  'end',
  'status'
];

const orderTypes = {
  id: 'STRING',
  title: 'STRING',
  owner: 'STRING',
  code: 'STRING',
  description: 'STRING',
  start: 'DATE',
  end: 'DATE',
  status: 'ENUM',
  deletedAt: 'TIMESTAMP',
  createdAt: 'TIMESTAMP',
  updatedAt: 'TIMESTAMP'
};

const associatedAliases = {
  owner: 'Owner',
  projectUsers: 'ProjectUsers'
};

const list = async (query) => {
  const { deleted, all, ...otherQuery } = query;

  const where = {};
  for (const prop of _validQueryProps) {
    if (otherQuery[prop] !== undefined) {
      where[prop] = otherQuery[prop];
    }
  }

  let orderQuery;
  if (query.order) {
    const orderString = Array.isArray(query.order)
      ? query.order[0]
      : query.order;
    const orderClause = buildOrder(associatedAliases, orderString, orderTypes);
    orderQuery = orderClause
      ? Project.sequelize.literal(orderClause)
      : [['title', 'ASC']];
  } else {
    // Default order
    orderQuery = [['title', 'ASC']];
  }

  let findOptions = {
    where,
    include: [
      {
        model: User,
        as: associatedAliases.owner,
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }
    ],
    order: orderQuery
  };

  if (deleted) {
    findOptions.paranoid = false;
  } else if (!all) {
    findOptions.paranoid = true;
  }

  const projects = await Project.findAll(findOptions);
  return projects;
};

const getByOwner = async (ownerId) => {
  if (!ownerId) {
    const error = new Error('Owner ID is required');
    error.status = 400;
    throw error;
  }

  const projects = await Project.findAll({
    where: { owner: ownerId },
    include: [
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }
    ]
  });

  if (!projects || projects.length === 0) {
    const error = new Error('No projects have been authored by this user');
    error.name = 'NoProjectsFoundError';
    error.status = 404;
    error.message = 'No projects have been authored by this user';
    throw error;
  }

  return projects;
};

const create = async (userQuery) => {
  const {
    title,
    owner,
    code,
    description,
    start,
    end,
    status,
    originalStatus
  } = userQuery;
  if (!title) {
    const error = new Error('Project name is required');
    error.status = 400;
    throw error;
  }

  const projectNameExists = await doesProjectTitleExist(title);
  if (projectNameExists) {
    const error = new Error('Project title already exists');
    error.name = 'ProjectTitleExistsError';
    error.status = 400;
    error.message = 'Project title already exists';
    throw error;
  }

  const projectCodeExists = await doesProjectCodeExist(code);
  if (projectCodeExists) {
    const error = new Error('Project code already exists');
    error.name = 'ProjectCodeExistsError';
    error.status = 400;
    error.message = 'Project code already exists';
    throw error;
  }

  const project = await Project.create({
    title,
    owner,
    code,
    description,
    start,
    end,
    status,
    originalStatus
  });
  return project;
};

const assignUserToProject = async (projectId, userId) => {
  const project = await doesProjectExist(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.name = 'ProjectNotFoundError';
    error.status = 404;
    error.message = 'Project does not exist';
    throw error;
  }

  const userExists = await doesUserExist(userId);
  if (!userExists) {
    const error = new Error('User not found');
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User does not exist';
    throw error;
  }

  const userAssigned = await isUserAssignedToProject(projectId, userId);
  if (userAssigned) {
    const error = new Error('User already assigned to project');
    error.name = 'UserAlreadyAssignedError';
    error.status = 400;
    error.message = 'User is already assigned to this project';
    throw error;
  }

  const projectUser = await ProjectUser.create({
    projectId,
    userId
  });

  return projectUser;
};

const assignMultipleUsersToProject = async (projectId, userIds) => {
  const project = await doesProjectExist(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.name = 'ProjectNotFoundError';
    error.status = 404;
    error.message = 'Project does not exist';
    throw error;
  }

  if (!Array.isArray(userIds) || userIds.length === 0) {
    const error = new Error('No user IDs provided');
    error.name = 'InvalidUserIdsError';
    error.status = 400;
    throw error;
  }

  const results = [];
  for (const userId of userIds) {
    const userExists = await doesUserExist(userId);
    if (!userExists) {
      results.push({ userId, status: 'failed', reason: 'User does not exist' });
      continue;
    }
    const alreadyAssigned = await isUserAssignedToProject(projectId, userId);
    if (alreadyAssigned) {
      results.push({ userId, status: 'skipped', reason: 'Already assigned' });
      continue;
    }
    await ProjectUser.create({ projectId, userId });
    results.push({ userId, status: 'assigned' });
  }
  return results;
};

const removeUserFromProject = async (projectId, userId) => {
  const projecct = await doesProjectExist(projectId);
  if (!projecct) {
    const error = new Error('Project not found');
    error.name = 'ProjectNotFoundError';
    error.status = 404;
    error.message = 'Project does not exist';
    throw error;
  }

  const userExists = await doesUserExist(userId);
  if (!userExists) {
    const error = new Error('User not found');
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User does not exist';
    throw error;
  }

  const assignment = await ProjectUser.findOne({
    where: { projectId, userId }
  });

  if (!assignment) {
    const error = new Error('User not assigned to this project');
    error.name = 'UserNotAssignedError';
    error.status = 404;
    error.message = 'User is not assigned to this project';
    throw error;
  }

  await assignment.destroy();
  return { projectId, userId, status: 'removed' };
}

const listProjectsOfUser = async (userId) => {
  const user = await doesUserExist(userId);
  if (!user) {
    const error = new Error('User not found');
    error.name = 'UserNotFoundError';
    error.status = 404;
    error.message = 'User does not exist';
    throw error;
  }

  const projects = await Project.findAll({
    include: [
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      },
      {
        model: ProjectUser,
        as: 'ProjectAssignments',
        where: { userId },
        required: true,
        attributes: ['userId', 'projectId', 'createdAt']
      }
    ],
    order: [['title', 'ASC']]
  });

  if (!projects || projects.length === 0) {
    const error = new Error('No projects found assigned to this user');
    error.name = 'NoProjectsFoundError';
    error.status = 404;
    error.message = 'No projects found assigned to this user';
    throw error;
  }

  return projects;
};

const listMembersOfProject = async (projectId) => {
  const project = await doesProjectExist(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.name = 'ProjectNotFoundError';
    error.status = 404;
    error.message = 'Project does not exist';
    throw error;
  }

  const members = await User.findAll({
    include: [
      {
        model: ProjectUser,
        as: 'ProjectAssignments',
        where: { projectId },
        required: true,
        attributes: ['userId', 'projectId', 'createdAt']
      }
    ],
    order: [['username', 'ASC']]
  });

  if (!members || members.length === 0) {
    const error = new Error('No members found for this project');
    error.name = 'NoMembersFoundError';
    error.status = 404;
    error.message = 'No members found for this project';
    throw error;
  }

  return members;
};

const update = async (id, updates, mode = 'patch') => {
  const project = await Project.findByPk(id);
  if (!project) {
    const error = new Error('Project not found');
    error.name = 'ProjectNotFoundError';
    error.status = 404;
    error.message = 'Project does not exist';
    error.details = { id };
    throw error;
  }

  const allowedFields = [
    'title',
    'owner',
    'code',
    'description',
    'start',
    'end',
    'status'
  ];

  // Validate unique title if changed
  if (updates.title && updates.title !== project.title) {
    if (await doesProjectTitleExist(updates.title)) {
      throw new Error('Project title already exists');
    }
  }
  // Validate unique code if changed
  if (updates.code && updates.code !== project.code) {
    if (await doesProjectCodeExist(updates.code)) {
      throw new Error('Project code already exists');
    }
  }

  let filteredUpdates = {};

  if (mode === 'PUT') {
    for (const field of allowedFields) {
      filteredUpdates[field] = updates.hasOwnProperty(field)
        ? updates[field]
        : null;
    }
  } else {
    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field)) {
        filteredUpdates[field] = updates[field];
      }
    }
  }

  await project.update(filteredUpdates);

  return await Project.findByPk(id, {
    include: [
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }
    ]
  });
};

const softDelete = async (id) => {
  const project = await doesProjectExist(id);
  if (!project) {
    const error = new Error('Project not found');
    error.name = 'ProjectNotFoundError';
    error.status = 404;
    error.message = 'Project does not exist';
    throw error;
  }

  if (project.deletedAt) {
    const error = new Error('Project already moved to trash');
    error.name = 'ProjectAlreadyDeletedError';
    error.status = 400;
    error.message = 'Project has already been moved to trash';
    throw error;
  }
  const originalStatus =
    project.status !== 'archived'
      ? project.status
      : project.originalStatus || 'to_do';

  await project.update({
    status: 'archived',
    originalStatus: originalStatus
  });

  await project.destroy();
  return project;
};

module.exports = {
  create,
  list,
  getByOwner,
  assignUserToProject,
  assignMultipleUsersToProject,
  removeUserFromProject,
  listProjectsOfUser,
  listMembersOfProject,
  update,
  softDelete
};
