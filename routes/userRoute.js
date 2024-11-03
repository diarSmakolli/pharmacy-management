const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');
const logger = require('../logger');


router.post('/register', async (req, res) => {
    const { name, username, password, organization, role } = req.body;
    try {

        if (!name || !username || !password || !organization || !role) {
            logger.error('All fields are required.');
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'All fields are required.'
            })
        }

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            logger.error('User already exists.');
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'User already exists'
            })
        }

        const user = await User.create({ name, username, password, organization, role });

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'User created successfully',
            data: user
        })
    } catch (error) {
        console.log(error);
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {

        if (!username || !password) {
            logger.error('All fields are required.');
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'All fields are required.'
            })
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Kredencialet gabim!'
            })
        }

        if (user.password !== password) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Kredencialet gabim!'
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, { httpOnly: true, secure: false });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Perdoruesi u kyq me sukses.',
            token,
            user
        })

    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Diqka shkoi gabim ne kodin e serverit.'
        })
    }
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Perdoruesi nuk u gjet.'
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Perdoruesi u gjet.',
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

router.get('/getall', verifyToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    try {
        const users = await User.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [['createdAt', 'DESC']]
        });

        if (users.length === 0) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Users not found'
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Users retrieved successfully.',
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal Server Error.'
        })
    }
});

router.post('/logout', verifyToken, async (req, res) => {
    try {
        res.clearCookie('token');

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User has been logged out successfully.'
        });
    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal Server Error.'
        })
    }
});

module.exports = router;