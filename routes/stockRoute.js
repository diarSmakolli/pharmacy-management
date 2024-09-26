const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax, Stock } = require('../models');
const { Op } = require('sequelize');

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
    console.log('error: ', error);
   }
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

// add a quantity of a stock
router.put("/add-stock/:id", async(req, res) => {
    try {
        const stockId = req.params.id;
        const { quantityToAdd } = req.body;

        if(!stockId) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Stock not found'
            });
        }

        const stock = await Stock.findByPk(stockId);

        if(!stock) {
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
        console.log("err: ", error);
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



// total products in stock
router.get('/reports/total-products-in-stock', async (req, res) => {
    try {
        const totalProductsInStock = await Stock.sum('quantity');
        res.json({ totalProductsInStock });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch total products in stock' });
    }
});


module.exports = router;