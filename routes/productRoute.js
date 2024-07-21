const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax, Stock } = require('../models');


// create product
router.post('/', async (req, res) => {
    const { name, barcode, description, price, quantity, partnerId, status, categoryId, taxId, initialStock  } = req.body;

    const product = await Product.create({
        name,
        barcode,
        description,
        price, // unit price
        quantity,
        partnerId,
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
        include: [Partner]
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
    const { name, barcode, description, price, discount, quantity, partnerId, status } = req.body;

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
        discount,
        quantity,
        partnerId,
        status
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
})

module.exports = router;