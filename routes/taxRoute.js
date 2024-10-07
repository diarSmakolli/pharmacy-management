const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax } = require('../models');
const logger = require('../logger');

// create tax
router.post('/', async (req, res) => {
    const { name, rate } = req.body;

    if (!name || !rate) {
        logger.error('Please provide all required fields');
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Please provide all required fields'
        });
    }

    try {

        const tax = await Tax.create({
            name,
            rate
        });

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: tax
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        });
    }
});

// get tax by id
router.get('/:id', async (req, res) => {
    const taxId = req.params.id;

    try {

        if (!taxId) {
            logger.error('Tax ID is required');
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Tax ID is required'
            });
        }

        const tax = await Tax.findByPk(taxId);

        if (!tax) {
            logger.error('Tax not found');
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
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong'
        });
    }
});

// get all taxes
router.get('/', async (req, res) => {
    try {
        const taxes = await Tax.findAll();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: taxes
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong'
        });
    }
});

// update tax
router.put('/:id', async (req, res) => {
    const taxId = req.params.id;
    const { name, rate } = req.body;
    try {

        if (!name || !rate) {
            logger.error('Please provide all required fields');
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Please provide all required fields'
            });
        }

        const tax = await Tax.findByPk(taxId);

        if (!tax) {
            logger.error('Tax not found');
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
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong'
        });
    }
});

// delete tax
router.delete('/:id', async (req, res) => {
    const taxId = req.params.id;
    try {

        if (!taxId) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Tax ID is required'
            });
        }

        const tax = await Tax.findByPk(taxId);

        if (!tax) {
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
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong'
        });
    }
});


module.exports = router;