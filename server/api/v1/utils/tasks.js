const createError = (message, details = null) => {
  const error = new Error(message);
  error.name = 'ValidationError';
  error.status = 400;
  if (details) error.details = details;
  throw error;
};

const validateTaskData = (data, isNewTask = true) => {
  const { title, reporter, status } = data;
  const validStatuses = ['to_do', 'in_progress', 'done', 'archived'];

  if (!title) createError('Task title is required');
  if (!reporter) createError('Task reporter is required');
  
  if (status) {
    if (!validStatuses.includes(status)) {
      createError('Invalid task status', { status, validValues: validStatuses });
    }
    
    if (isNewTask && status === 'archived') {
      createError('New tasks cannot be created with status "archived"');
    }
  }
};

module.exports = {
  validateTaskData
};