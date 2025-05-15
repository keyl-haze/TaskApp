const service = require('./service');

const list = async (req, res) => {
  try {
    const users = await service.list(req.query);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
  return;
};

const get = async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'ID must be a positive integer'
    });
  }

  try {
    const user = await service.get(id);
    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({
        error: 'User not found',
        message: `User with ID ${id} not found`
      });
    }
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const create = async (req, res) => {
  try {
    const user = await service.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
  return;
};

module.exports = {
  list,
  get,
  create
};
