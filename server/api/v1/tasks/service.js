const { Task, User } = require('../../../models');
const { taskWhereFilter, buildOrder } = require('../utils/queries');
const { validateStatus, validateTaskData } = require('../utils/tasks');

const _validQueryProps = [
  'id',
  'title',
  'description',
  'type',
  'priority',
  'status',
  'reporter',
  'assignee'
];
const orderTypes = {
  id: 'STRING',
  title: 'STRING',
  description: 'STRING',
  type: 'ENUM',
  priority: 'ENUM',
  status: 'ENUM',
  reporter: 'STRING',
  assignee: 'STRING',
  deletedAt: 'TIMESTAMP',
  createdAt: 'TIMESTAMP',
  updatedAt: 'TIMESTAMP'
};

const associatedAliases = {
  reporter: 'Reporter',
  assignee: 'Assignee'
};

const list = async (query) => {
  const { deleted, all, ...otherQuery } = query;

  const where = taskWhereFilter(_validQueryProps, otherQuery.filter, Task.name);
  let orderQuery;
  if (query.order) {
    const orderString = Array.isArray(query.order)
      ? query.order[0]
      : query.order;
    const orderClause = buildOrder(associatedAliases, orderString, orderTypes);
    orderQuery = orderClause
      ? Task.sequelize.literal(orderClause)
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
        as: 'Reporter',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      },
      {
        model: User,
        as: 'Assignee',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }
    ],
    order: orderQuery
  };

  if (all || deleted) {
    findOptions.paranoid = false;
  }
  const tasks = await Task.findAll(findOptions);
  return tasks;
};

const get = async (id, options = {}) => {
  if (!/^\d+$/.test(id)) {
    const error = new Error();
    error.name = 'InvalidIdError';
    error.status = 400;
    error.message = 'Task not found';
    error.details = { id };
    throw error;
  }

  const findOptions = {
    ...options,
    include: [
      {
        model: User,
        as: 'Reporter',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      },
      {
        model: User,
        as: 'Assignee',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName']
      }
    ]
  };

  const task = await Task.findByPk(id, findOptions);
  if (!task) {
    const error = new Error();
    error.name = 'TaskNotFoundError';
    error.status = 404;
    error.message = 'Task not found';
    error.details = { id };
    throw error;
  }
  return task;
};

const create = async (data) => {
  const { title, description, type, priority, status, reporter, assignee } =
    data;

  if (!title) {
    const error = new Error();
    error.name = 'ValidationError';
    error.status = 400;
    error.message = 'Task title is required';
    throw error;
  }
  if (!reporter) {
    const error = new Error();
    error.name = 'ValidationError';
    error.status = 400;
    error.message = 'Task reporter is required';
    throw error;
  }

  validateStatus(data);

  const newTask = await Task.create({
    title,
    description,
    type,
    priority,
    status,
    reporter,
    assignee
  });

  return await get(newTask.id);
};

const update = async (id, updates, mode = 'patch') => {
  const task = await Task.findByPk(id);
  if (!task) {
    const error = new Error();
    error.name = 'TaskNotFoundError';
    error.status = 404;
    error.message = 'Task not found';
    error.details = { id };
    throw error;
  }

  const allowedFields = [
    'title',
    'description',
    'type',
    'priority',
    'status',
    'reporter',
    'assignee'
  ];

  validateStatus(updates.status);

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

  await task.update(filteredUpdates);
  return await get(id);
};

const softDelete = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) {
    const error = new Error();
    error.name = 'TaskNotFoundError';
    error.status = 404;
    error.message = 'Task not found';
    error.details = { id };
    throw error;
  }

  const originalStatus =
    task.status !== 'archived' ? task.status : task.originalStatus || 'to_do';

  await task.update({
    status: 'archived',
    originalStatus: originalStatus
  });
  await task.destroy();
  return task;
};

const restore = async (id) => {
  const task = await Task.findByPk(id, { paranoid: false });
  if (!task) {
    const error = new Error();
    error.name = 'TaskNotFoundError';
    error.status = 404;
    error.message = 'Task not found';
    error.details = { id };
    throw error;
  }

  if (!task.deletedAt) {
    const error = new Error();
    error.name = 'TaskNotDeletedError';
    error.status = 400;
    error.message = 'Task is not deleted';
    error.details = { id };
    throw error;
  }

  await task.restore();

  const statusToRestore = task.originalStatus || 'to_do';
  await task.update({
    status: statusToRestore,
    originalStatus: null // Clear the stored original status after restoration
  });

  return await get(id);
};

module.exports = {
  create,
  list,
  get,
  update,
  softDelete,
  restore
};
