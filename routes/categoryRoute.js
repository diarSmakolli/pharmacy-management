const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax } = require('../models');
const logger = require('../logger');

// create for category
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            logger.error('All fields are required.');
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'All fields are required.'
            });
        }

        const category = await Category.create({
            name
        });

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: category
        });
    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

// get category by id
router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {

        const category = await Category.findByPk(categoryId);

        if (!category) {
            logger.error('Category not found');
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: category
        });
    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

// get all category
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: categories
        });
    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

// delete category
router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {

        const category = await Category.findByPk(categoryId);

        if (!category) {
            logger.error('Category not found');
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Category not found'
            });
        }

        await category.destroy();

        return res.status(204).json();
    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

module.exports = router;