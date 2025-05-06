const { Op } = require('sequelize');
const { User } = require('../models');

// * GET all users details, except password
exports.getAllUsers = async (req, res) => {
  try {
    const filters = req.query.filter || {};
    const parsedFilters =
      typeof filters === 'string' ? JSON.parse(filters) : filters;

    const where = {};

    Object.keys(parsedFilters).forEach((key) => {
      if (key === 'role') {
        where.role = parsedFilters[key];
      } else {
        where[key] = { [Op.iLike]: `%${parsedFilters[key]}%` };
      }
    });

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// * POST create user
exports.createUser = async (req, res) => {
  const { username, firstName, middleName, lastName, role, email, password } =
    req.body;

  try {
    // * Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // * Create new user
    const newUser = await User.create({
      username,
      firstName,
      middleName,
      lastName,
      role,
      email,
      password
    });

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};
