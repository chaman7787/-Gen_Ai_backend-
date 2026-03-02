const express = require('express');
const userController = require('../Controllers/user.controller.js');
const router = express.Router();


// Register user
router.post('/register', userController.registerUser);


module.exports = router;
