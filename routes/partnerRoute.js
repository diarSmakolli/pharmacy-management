const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');


// create an partner
router.post('/', async (req, res) => {
    const { name, businessNumber, fiscalNumber, commune, address, status, phoneNumber, email  } = req.body;
    try {
        const existingPartner = await Partner.findOne({ where: { businessNumber } });

        if (existingPartner) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Partner already exists'
            })
        }

        const partner = await Partner.create({ name, businessNumber, fiscalNumber, commune, address, status: 'active', phoneNumber, email });

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'Partner created successfully',
            data: partner
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

// get partner by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // const partner = await Partner.findOne({ where: { id } });

        const partner = await Partner.findByPk(id, {
            include: ['products']
        })

        if (!partner) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Partner not found'
            })
        }

        if (partner.status === 'inactive') {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Partner not found'
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: partner
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

// get all partners
router.get('/', async (req, res) => {
    try {
        const partners = await Partner.findAll({ where: { status: 'active' } });

        if (!partners) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'No partners found'
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: partners
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

// delete the partner
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const partner = await Partner.findOne({ where: { id } });

        if (!partner) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Partner not found'
            })
        }

        await Partner.update({ status: 'inactive' }, { where: { id } });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Partner deleted successfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});

// update the partner
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, businessNumber, fiscalNumber, commune, address, phoneNumber, email } = req.body;
    try {
        const partner = await Partner.findOne({ where: { id } });

        if (!partner) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Partner not found'
            })
        }

        await Partner.update({ name, businessNumber, fiscalNumber, commune, address }, { where: { id } });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Partner updated successfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        })
    }
});


module.exports = router;