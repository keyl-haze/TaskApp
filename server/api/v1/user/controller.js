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
  try {
    const user = await service.get(
      { id: req.params.id },
      {
        attributes: { exclude: ['password'] }
      }
    );
    res.status(200).json(user);
  } catch (error) {
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
