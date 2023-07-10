const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users.controller');
const userController = new UserController();

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
