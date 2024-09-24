const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax, Stock } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// create product
router.post('/', async (req, res) => {
    const { name, barcode, description, price, discount, partnerId, status, categoryId, taxId, initialStock  } = req.body;

    const product = await Product.create({
        name,
        barcode,
        description,
        price,
        discount,
        partnerId,
        categoryId,
        taxId,
        status: 'active'
    });

    await Stock.create({
        productId: product.id,
        quantity: initialStock
    });

    return res.status(201).json({
        status: 'success',
        statusCode: 201,
        data: product
    });
});

router.get('/search', async (req, res) => {
    try {
        let { page = 1, limit = 10, keyword } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let whereClause = {};

        if (keyword) {
            whereClause = {
                // [Op.or]: [
                //     { name: { [Op.like]: `%${keyword}%` } },
                //     { surname: { [Op.like]: `%${keyword}%` } },
                // ]
                [Op.or]: [
                    { name: { [Op.iLike]: `%${keyword}%` } },  // Case-insensitive search
                    { barcode: { [Op.iLike]: `%${keyword}%` } }  // Case-insensitive search
                ]
            };
        }

        const products = await Product.findAndCountAll({
            where: whereClause,
            offset: (page - 1) * limit,
            limit: limit
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get product by id
router.get('/:id', async (req, res) => {
    
    const productId = req.params.id;

  // get product included the partner
    const product = await Product.findByPk(productId, {
        include: [Partner, Tax, Category, Stock]
    });

    if(product.status === 'inactive') {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Product not found'
        });
    }

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: product
    });
});


// get all products
router.get('/', async (req, res) => {
    const products = await Product.findAll({
        where: { status: 'active' },
        include: [Partner, Tax, Category, Stock]
    });

    if(products.length === 0) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'No products found'
        });
    }

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: products
    });
});



// update product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, barcode, description, price, partnerId, status, categoryId, taxId } = req.body;

    const product = await Product.findOne({ where: { id } });

    if(!product) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Product not found'
        });
    }

    await product.update({
        name,
        barcode,
        description,
        price,
        partnerId,
        status,
        categoryId,
        taxId
    });
    

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: product
    });
});



// delete the product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    const product = await Product.findOne({ where: { id } });

    if(!product) {
        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'Product not found'
        });
    }

    await product.update({ status: 'inactive' });

    return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Product deleted successfully'
    });
});


// Search products by name (partial match)
// router.get('/search', async (req, res) => {
//     const { search } = req.query;  // Get the search query

//     if (!search) {
//         return res.status(400).json({
//             status: 'error',
//             statusCode: 400,
//             message: 'Search query cannot be empty'
//         });
//     }

//     try {
//         // Find products where the name matches the search string (case-insensitive)
//         const products = await Product.findAll({
//             where: {
//                 name: {
//                     [Op.like]: `%${search}%` // Partial match, case insensitive
//                 },
//                 status: 'active'
//             },
//             // include: [Partner, Tax, Category, Stock],
//             limit: 10 // Optional: limit results for performance reasons
//         });

//         if (products.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 statusCode: 404,
//                 message: 'No products found'
//             });
//         }

//         return res.status(200).json({
//             status: 'success',
//             statusCode: 200,
//             data: products
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: 'error',
//             statusCode: 500,
//             message: 'An error occurred while searching for products',
//             error: error.message
//         });
//     }
// });

module.exports = router;