const express = require('express');
const router = new express.Router();

const users = require('./users');
const tasks = require('./tasks');
const projects = require('./projects');
const authController = require(`${__serverRoot}/api/v1/auth/controller`);

module.exports = () => {
  router.use('/users', users);
  router.use('/tasks', tasks);
  router.use('/projects', projects);
  router.use('/auth', authController);
  return router;
};
