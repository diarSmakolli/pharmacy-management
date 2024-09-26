const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax, Stock, OrderProduct, Order, Invoice } = require('../models');
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
        include: [Partner, Tax, Category, Invoice]
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
// router.get('/', async (req, res) => {
//     const products = await Product.findAll({
//         where: { status: 'active' },
//         include: [Partner, Tax, Category, Stock]
//     });

//     if(products.length === 0) {
//         return res.status(404).json({
//             status: 'error',
//             statusCode: 404,
//             message: 'No products found'
//         });
//     }

//     return res.status(200).json({
//         status: 'success',
//         statusCode: 200,
//         data: products
//     });
// });

router.get('/', async (req, res) => {
    try {
        let { page = 1, limit = 10, categoryId, partnerId, status, search, priceFilter, idFilter, taxId } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        // Construct where clause for filtering
        let whereClause = { status: 'active' };

        if (categoryId) {
            whereClause.categoryId = categoryId; // Filter by category
        }

        if (partnerId) {
            whereClause.partnerId = partnerId; // Filter by partner
        }

        if (status) {
            whereClause.status = status; // Optionally filter by status
        }

        if(taxId) {
            whereClause.taxId = taxId;
        }

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },  
                { barcode: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        // Define order clause based on price filter
        let orderClause = [];
        if (priceFilter === 'asc') {
            orderClause.push(['price', 'ASC']); // Order by price ascending
        } else if (priceFilter === 'desc') {
            orderClause.push(['price', 'DESC']); // Order by price descending
        }


        if(idFilter === 'asc') {
            orderClause.push(['id', 'ASC']);
        } else if(idFilter === 'desc') {
            orderClause.push(['id', 'DESC']);
        }


        // Fetch products with pagination
        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            include: [Partner, Tax, Category, Stock],
            offset: (page - 1) * limit,
            limit: limit,
            order: orderClause
        });

    

        // Check if products were found
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'No products found',
            });
        }

        // Return paginated response
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                total: count,
                page,
                limit,
                products: rows,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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


module.exports = router;    