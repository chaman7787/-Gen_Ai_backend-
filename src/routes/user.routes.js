const express = require('express');
const userController = require('../Controllers/user.controller.js');
const router = express.Router();
const authMiddleware = require('../middleware/user.middleware.js');

// Register user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);


// Logout user
router.post('/logout', userController.logoutUser);

//get my userdata
router.get('/get-me',authMiddleware,userController.getMyData);

module.exports = router;
