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

// TODO Keil and Julia :)
const create = async (req, res) => {
  
  return;
};

module.exports = {
  list,
  create
};
