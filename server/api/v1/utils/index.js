const promiseController = (api) => async (req, res) => {
  try{
    const { status = 200, message = 'Success', data } = await api(req, res);
    return res.status(status).json({
      status: 'success',
      message,
      data,
    });
  } catch (error) {
    console.error('Controller error:', error);

    const status = error.status || 500;
    const type = status >= 500 ? 'server' : 'client';

    return res.status(status).json({
      status: 'error',
      type,
      message: error.message || 'An error occurred',
      error: error.details || null,
    });
  }
}

module.exports = {
  promiseController,
};