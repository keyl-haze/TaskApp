const validateStatus = (status) => {
  const validStatuses = ['to_do', 'in_progress', 'done', 'archived'];
  if (status && !validStatuses.includes(status)) {
    const error = new Error();
    error.name = 'ValidationError';
    error.status = 400;
    error.message = 'Invalid task status';
    error.details = { status, validValues: validStatuses };
    throw error;
  }
};

const validateTaskData = (data) => {
  const { title, reporter, status } = data;

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

  validateStatus(status);
};

module.exports = {
  validateStatus,
  validateTaskData
};