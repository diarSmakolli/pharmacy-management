const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax } = require('../models');


// create tax
router.post('/', async (req, res) => {
    const { name, rate } = req.body;

    const tax = await Tax.create({
        name,
        rate
    });

    return res.status(201).json({
        status: 'success',
        statusCode: 201,
        data: tax
    });
});

// get tax by id
router.get('/:id', async (req, res) => {
    const taxId = req.params.id;

    const tax = await Tax.findByPk(taxId);

    if(!tax) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Tax not found'
        });
    }

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: tax
    });
});

// get all taxes
router.get('/', async (req, res) => {
    const taxes = await Tax.findAll();

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: taxes
    });
});

// update tax
router.put('/:id', async (req, res) => {
    const taxId = req.params.id;
    const { name, rate } = req.body;

    const tax = await Tax.findByPk(taxId);

    if(!tax) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Tax not found'
        });
    }

    tax.name = name;
    tax.rate = rate;

    await tax.save();

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: tax
    });
});

// delete tax
router.delete('/:id', async (req, res) => {
    const taxId = req.params.id;
    
    const tax = await Tax.findByPk(taxId);

    if(!tax) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Tax not found'
        });
    }

    await tax.destroy();

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Tax deleted successfully'
    });
});


module.exports = router;