const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax } = require('../models');


// create for category
router.post('/', async (req, res) => {
    const { name } = req.body;

    const category = await Category.create({
        name
    });

    return res.status(201).json({
        status: 'success',
        statusCode: 201,
        data: category
    });
});


// get category by id
router.get('/:id', async (req, res) => {
    const categoryId = req.params.id;

    const category = await Category.findByPk(categoryId);

    if(!category) {
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
});

// get all category
router.get('/', async (req, res) => {
    const categories = await Category.findAll();

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: categories
    });
});

// update category
router.put('/:id', async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    const category = await Category.findByPk(categoryId);

    if(!category) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Category not found'
        });
    }

    category.name = name;
    await category.save();

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: category
    });
});

// delete category
router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;

    const category = await Category.findByPk(categoryId);

    if(!category) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Category not found'
        });
    }

    await category.destroy();

    return res.status(204).json();
});

// GET /categories/{categoryId}/products: Retrieve all products within a specific category.
// POST /categories/{categoryId}/products: Create a new product within a specific category.


module.exports = router;