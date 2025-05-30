const express = require('express');
const router = new express.Router();
const users = require('./users');
const tasks = require('./tasks');

module.exports = () => {
  router.use('/users', users);
  router.use('/tasks', tasks);
  return router;
};
