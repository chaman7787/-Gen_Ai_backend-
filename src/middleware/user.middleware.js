const jwt = require('jsonwebtoken');
dotenv = require('dotenv');
dotenv.config();
const UserModel = require('../models/user.model.js');
const TokenBlacklist = require('../models/token.model.js');

//auth moddleware to protect routes
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        const tokenInBlacklist = await TokenBlacklist.findOne({
            token: token
        });
        if (tokenInBlacklist) {
            return res.status(401).json({
                message: 'Token is blacklisted'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }   
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            message: 'Authentication failed'
        });
    }
};

module.exports = authMiddleware;