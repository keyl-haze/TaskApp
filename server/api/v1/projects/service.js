const { Project, ProjectUser, User } = require(`${__serverRoot}/models`);
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
    orderQuery = orderString
      ? Project.sequelize.literal(orderString, orderTypes)
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
        as: 'Owner',
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

const listProjectsByUser = async (userId) => {
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
        model: ProjectUser,
        where: { userId },
        required: true
      }
    ],
    order: [['title', 'ASC']]
  });

  return projects;
}

module.exports = {
  create,
  list,
  getByOwner,
  assignUserToProject,
  listProjectsByUser,
};
