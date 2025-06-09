const express = require('express');
const router = new express.Router();
const controller = require(`${__serverRoot}/api/v1/projects/controller`);
router.post('/', controller.create);
router.get('/', controller.list);
module.exports = router;