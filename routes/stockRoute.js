const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax, Stock } = require('../models');


// get stock by id
router.get('/:id', async (req, res) => {
    
    const stockId = req.params.id;

  // get product included the partner
    const stock = await Stock.findByPk(stockId, {
        include: [Product]
    });

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: stock
    });
});

// get all stocks
router.get('/', async (req, res) => {
    
    const stocks = await Stock.findAll({
        include: [Product]
    });

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: stocks
    });
});

// create stock
router.post('/', async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Product not found'
        });
    }

    const stock = await Stock.create({
        productId,
        quantity
    });

    return res.status(201).json({
        status: 'success',
        statusCode: 201,
        data: stock
    });
});

// update a stock by id
router.put('/:id', async (req, res) => {
    const stockId = req.params.id;
    const { quantity } = req.body;

    const stock = await Stock.findByPk(stockId);

    if (!stock) {
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
});

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