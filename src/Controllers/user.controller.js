const UserModel = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv = require('dotenv');
dotenv.config();

//register user controller
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await UserModel.findOne({
            email: email
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hasPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hasPassword
        });

        const token = jwt.sign({
            id : newUser._id,username: newUser.name
        }, process.env.JWT_SECRET, { expiresIn: '3h' });

        res.cookie('token', token,);

        await newUser.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token: token
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }   

}

module.exports = {
    registerUser
};
