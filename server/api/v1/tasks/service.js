const { Task, User } = require('../../../models');
const { taskWhereFilter } = require('../utils/queries');

const create = async (data) => {
  const { title, description, type, priority, reporter, assignee } = data;

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

  const newTask = await Task.create({
    title,
    description,
    type,
    priority,
    reporter,
    assignee
  });

  return await get(newTask.id);
};

const _validQueryProps = [
  'id',
  'title',
  'description',
  'type',
  'priority',
  'reporter',
  'assignee'
];

const list = async (query) => {
  const { deleted, all, ...otherQuery } = query;

  const where = taskWhereFilter(_validQueryProps, otherQuery.filter, Task.name);

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
    ]
  };

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
    'reporter',
    'assignee'
  ];

  let filteredUpdates = {};

  if (mode === 'PUT') {
    for (const field of allowedFields) {
      filteredUpdates[field] = updates.hasOwnProperty(field)
        ? updates[field]
        : null;
    }
  } else {
    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field) && updates[field] !== null) {
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
  return task;
};

module.exports = {
  create,
  list,
  get,
  update,
  softDelete,
  restore
};
