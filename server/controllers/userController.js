const { Op } = require('sequelize');
const { parseFilters } = require('../utils/parseFilters');
const { User } = require('../models');
const { doesEmailExist } = require('../utils/usersUtils');
const { doesUsernameExist } = require('../utils/usersUtils');

// * GET all users details, except password
exports.getAllUsers = async (req, res) => {
  try {
    const filters = parseFilters(req.query);

    const where = {};

    // console.log('req.query:', req.query);
    // console.log('req.query:', req.query.filter);
    // console.log('req.query:', req.query.filter.firstName);

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (key === 'role') {
        where.role = value;
      } else {
        where[key] = { [Op.iLike]: `%${value}%` };
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
    const emailExists = await doesEmailExist(email);
    const usernameExists = await doesUsernameExist(username);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    } else if (usernameExists) {
      return res.status(400).json({ error: 'Username already exists' });
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
