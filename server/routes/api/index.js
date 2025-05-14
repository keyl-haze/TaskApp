const express = require('express');
const v1 = require('./v1');
const router = express.Router();

module.exports = () => {
  router.use('/v1', v1());

  return router;
};
