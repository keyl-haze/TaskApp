// Success response
function success(res, data, message = 'Success', status = 200) {
  return res.status(status).json({
    status: 'success',
    message,
    data,
  });
}

// Client error response (4xx)
function clientError(res, message = 'Client Error', status = 400, error = null) {
  return res.status(status).json({
    status: 'error',
    type: 'client',
    message,
    error,
  });
}

// Server error response (5xx, including DB errors)
function serverError(res, message = 'Server Error', status = 500, error = null) {
  return res.status(status).json({
    status: 'error',
    type: 'server',
    message,
    error,
  });
}

module.exports = {
  success,
  clientError,
  serverError,
};