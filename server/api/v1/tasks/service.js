const { Task } = require('../../../models');
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

  // Validate type and priority values
  const validTypes = ['bug', 'feature', 'task'];
  if (type && !validTypes.includes(type)) {
    const error = new Error();
    error.name = 'ValidationError';
    error.status = 400;
    error.message = `Task type must be one of: ${validTypes.join(', ')}`;
    throw error;
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    const error = new Error();
    error.name = 'ValidationError';
    error.status = 400;
    error.message = `Task priority must be one of: ${validPriorities.join(', ')}`;
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

  return newTask;
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

  let findOptions = { where };

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
  const task = await Task.findByPk(id, options);
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

  // Validate type and priority if present
  const validTypes = ['bug', 'feature', 'task'];
  if (
    filteredUpdates.hasOwnProperty('type') &&
    filteredUpdates.type !== null &&
    !validTypes.includes(filteredUpdates.type)
  ) {
    const error = new Error();
    error.name = 'ValidationError';
    error.status = 400;
    error.message = `Task type must be one of: ${validTypes.join(', ')}`;
    throw error;
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (
    filteredUpdates.hasOwnProperty('priority') &&
    filteredUpdates.priority !== null &&
    !validPriorities.includes(filteredUpdates.priority)
  ) {
    const error = new Error();
    error.name = 'ValidationError';
    error.status = 400;
    error.message = `Task priority must be one of: ${validPriorities.join(', ')}`;
    throw error;
  }

  await task.update(filteredUpdates);
  return task;
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
