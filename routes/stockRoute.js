const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax, Stock } = require('../models');
const { Op } = require('sequelize');
const logger = require('../logger');


// get all stocks
router.get('/', async (req, res) => {
   try {
        let { page = 1, limit = 10, stockId, productId, minQuantity, maxQuantity, sortById } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        let whereClause = {};

        if(stockId) {
            whereClause.id = stockId;
        }

        if(productId) {
            whereClause.productId = productId;
        }

        if(minQuantity && maxQuantity) {
            whereClause.quantity = {
                [Op.between]: [minQuantity, maxQuantity]
            }
        }

        let orderClause = [];

        if(sortById === 'asc') {
            orderClause.push(['id', 'ASC']);
        } else if(sortById === 'desc') {
            orderClause.push(['id', 'DESC']);
        }


        const { count, rows} = await Stock.findAndCountAll({
            where: whereClause,
            offset: (page - 1) * limit,
            limit,
            include: [Product],
            order: orderClause
        });

        if(rows.length === 0) {
            logger.error('No stocks found');    
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'No stocks found'
            });
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                total: count,
                page,
                limit,
                stocks: rows
            }
        });


   } catch(error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong'
        });
   }
});


// update a stock by id
router.put('/:id', async (req, res) => {
    const stockId = req.params.id;
    const { quantity } = req.body;

    if(!quantity) {
        logger.error('Quantity is required');
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Quantity is required'
        });
    }   
    try {
        const stock = await Stock.findByPk(stockId);

        if (!stock) {
            logger.error('Stock not found');
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Stock not found'
            });
        }

        stock.quantity = quantity;
        await stock.save();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: stock
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

// add a quantity of a stock
router.put("/add-stock/:id", async(req, res) => {
    const stockId = req.params.id;
    const { quantityToAdd } = req.body;

    if(!quantityToAdd) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Quantity to add is required'
        });
    }
    try {
        
        if(!stockId) {
            logger.error('Stock not found');
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Stock not found'
            });
        }

        const stock = await Stock.findByPk(stockId);

        if(!stock) {
            logger.error('Stock not found');
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Stock not found'
            });
        }

        stock.quantity = parseInt(stock.quantity) + parseInt(quantityToAdd);
        await stock.save();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Stock quantity updated successfully',
            data: stock
        })

    } catch(error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong'
        });
    }
})

// // delete a stock by id
// router.delete('/:id', async (req, res) => {
//     const stockId = req.params.id;

//     const stock = await Stock.findByPk(stockId);

//     if (!stock) {
//         return res.status(404).json({
//             status: 'error',
//             statusCode: 404,
//             message: 'Stock not found'
//         });
//     }

//     await stock.destroy();

//     return res.status(204).json();
// });




module.exports = router;