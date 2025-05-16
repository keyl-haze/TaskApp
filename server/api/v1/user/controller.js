const service = require('./service');
const { success, clientError, serverError } = require('../utils/response');

const list = async (req, res) => {
  try {
    const users = await service.list(req.query);
    return success(res, users, 'Users fetched successfully');
  } catch (error) {
    console.error('Error fetching users:', error);
    return serverError(res, 'Failed to fetch users', 500, error.message);
  }
};

const get = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return clientError(res, 'Entered ID is incorrect type', 400);
  }

  try {
    const user = await service.get(id);
    if (!user) {
      return clientError(res, `User with ID ${id} not found`, 404);
    }
    return success(res, user, 'User fetched successfully');
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return clientError(res, `User with ID ${id} not found`, 404);
    }
    console.error('Error fetching user:', error);
    return serverError(res, 'Failed to fetch user', 500, error.message);
  }
};

const create = async (req, res) => {
  try {
    const user = await service.create(req.body);
    return success(res, user, 'User created successfully', 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return serverError(res, 'Failed to create user', 500, error.message);
  }
};

module.exports = {
  list,
  get,
  create
};
