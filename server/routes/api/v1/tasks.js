const express = require('express');
const router = new express.Router();
const controller = require(`${__serverRoot}/api/v1/tasks/controller`);

router.post('/', controller.create);

module.exports = router;