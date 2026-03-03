const UserModel = require('../models/user.model.js');
const TokenBlacklist = require('../models/token.model.js');
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


// login user controller
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const existingUser = await UserModel.findOne({
            email: email
        }); 
        if (!existingUser) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }
        const token = jwt.sign({
            id : existingUser._id,username: existingUser.name
        }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.cookie('token', token,);
        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            },
            token: token
        });
    }
        catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

//logout user controller
async function logoutUser(req, res) {
    try {
        const token = req.cookies.token;
        if (token) {
           const blacklistToken = new TokenBlacklist({
                token: token,
                expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
            });
           await blacklistToken.save();
        }
        res.clearCookie('token');
      
        res.status(200).json({
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

//get my data
async function getMyData(req,res){
    try {
        const user = req.user;
        res.status(200).json({
            message: 'User data retrieved successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email

            }
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMyData
};
