const { Project, ProjectUser, User } = require(`${__serverRoot}/models`);
const { getByField } = require('../utils/projects');

const _validQueryProps = [
  'id',
  'title',
  'owner',
  'code',
  'description',
  'start',
  'end',
  'status'
]

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
}


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
}

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

  const projectNameExists = await getByField(Project, 'title', title);
  if (projectNameExists) {
    const error = new Error('Project name already exists');
    error.name = 'ProjectNameExistsError';
    error.status = 400;
    error.message = 'Project name already exists';
    throw error;
  }
  // Check if project code exists
  if (code) {
    const projectCodeExists = await getByField(Project, 'code', code);
    if (projectCodeExists) {
      const error = new Error('Project code already exists');
      error.name = 'ProjectCodeExistsError';
      error.status = 400;
      throw error;
    }
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

module.exports = {
  create,
  list
};
