const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);        // * GET all users details, except password *//
router.post('/', userController.createUser);    // * POST create user *//

module.exports = router;
