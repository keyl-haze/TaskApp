const express = require('express');
const router = new express.Router();
const users = require('./users.js');
module.exports = () => {
  router.use('/users', users);
  return router;
};
