const express = require('express');
const router = new express.Router();
const controller = require(`${__serverRoot}/api/v1/tasks/controller`);

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.get);

module.exports = router;
