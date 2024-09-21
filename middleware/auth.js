const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async(req, res, next) => {
    try {

        const token = req.cookies['token'];

        if(!token) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'You are logged out, please log in to have access in this feature.'
            })
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRETJWT);
        } catch(err) {
            res.clearCookie('token');
            
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'Token is invalid or expired'
            });
        }
 
        const user = await User.findOne({ id: decoded.id });

        if(!user) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'User cannot be found.'
            })
        }

        req.user = user;
        next();
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal Server Error.'
        })
    }
};

module.exports = { verifyToken };   // Export the middleware function