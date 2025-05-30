const { Task } = require('../../../models');

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

module.exports = {
  create
};