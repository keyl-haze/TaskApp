const express = require('express');
const router = new express.Router();

const users = require('./users');
const tasks = require('./tasks');
const projects = require('./projects');

module.exports = () => {
  router.use('/users', users);
  router.use('/tasks', tasks);
  router.use('/projects', projects);
  return router;
};
