const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const { Op } = require('sequelize');


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
        let { page = 1, limit = 10, search, partnerId,  idFilter } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        let whereClause = {};

        if(search) {
            whereClause[Op.or] = [
                // { id: { [Op.eq]: search } },
                { name: { [Op.iLike]: `%${search}%` } },
                { businessNumber: { [Op.iLike]: `%${search}%` } },
                { fiscalNumber: { [Op.iLike]: `%${search}%` } },
                { commune: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ]
        }

        if(partnerId) {
            whereClause.id = partnerId;
        }

        const orderClause = [];
        if(idFilter === 'asc') {
            orderClause.push(['id', 'ASC']);
        } else if(idFilter === 'desc') {
            orderClause.push(['id', 'DESC']);
        }

        

        const { count, rows } = await Partner.findAndCountAll({
             where: whereClause,
             offset: (page - 1) * limit,
             limit: limit,
             order: orderClause  
        });

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Asnje partner nuk u gjet!'
            })
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            total: count,
            page,
            limit,
            partners: rows
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

        await Partner.update({ name, businessNumber, fiscalNumber, commune, address , phoneNumber, email }, { where: { id } });

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