const express = require('express');
const router = new express.Router();
const controller = require(`${__serverRoot}/api/v1/user/controller`);
console.log('controller', controller);
router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
module.exports = router;
