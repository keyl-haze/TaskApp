const express = require('express');
const router = new express.Router();
const users = require('./users');
module.exports = () => {
  router.use('/users', users);
  return router;
};
