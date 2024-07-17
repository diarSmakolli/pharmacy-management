const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async(req, res) => {
    const { name, username, password, organization, role } = req.body;
    try {

        const existingUser = await User.findOne({ where: { username } });

        if(existingUser) {
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
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    try {

        const user = await User.findOne({ where: { username, password } });

        if(!user) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Invalid credentials'
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User logged in successfully',
            data: user
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

router.get('/:id', async(req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);

        if(!user) {
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
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

module.exports = router;