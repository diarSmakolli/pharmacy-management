const express = require('express');
const router = express.Router();
const { Order, Product, OrderProduct, Tax } = require('../models');

// router.post('/', async (req, res) => {
//     const { products } = req.body;

//     try {
//         // Calculate the total amount
//         let total_amount = 0;
//         let tax_percentage = 0;
//         let tax_amount = 0;
//         let total_amount_with_tax = 0;
//         let total_amount_without_tax = 0;

//         products.forEach(async product => {
//             total_amount += product.unitPrice * product.quantity;
//         });

//         // Create the order
//         const order = await Order.create({
//             total_amount,
//             created_at: new Date()
//         });

//         // Add products to order
//         await Promise.all(products.map(async product => {
//             await OrderProduct.create({
//                 orderId: order.id,
//                 productId: product.productId,
//                 quantity: product.quantity,
//                 unitPrice: product.unitPrice
//             });
//         }));

//         return res.status(201).json({
//             status: 'success',
//             statusCode: 201,
//             data: order,
//             total_amount,
//             tax_percentage,
//             tax_amount,
//             total_amount_with_tax,
//             total_amount_without_tax
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: 'error',
//             statusCode: 500,
//             message: error.message
//         });
//     }
// });

router.post('/', async (req, res) => {
    const { products } = req.body;

    try {
        // Initialize variables for calculations
        let total_amount = 0;
        let total_amount_excl_tax = 0;
        let total_tax_amount = 0;
        let total_amount_incl_tax = 0;

        // Loop through products to calculate amounts
        for (const product of products) {
            const productDetails = await Product.findByPk(product.productId);
            if (!productDetails) {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: `Product with ID ${product.productId} not found`
                });
            }

            const taxDetails = await Tax.findByPk(productDetails.taxId);
            if (!taxDetails) {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: `Tax with ID ${productDetails.taxId} not found`
                });
            }

            total_amount += product.unitPrice * product.quantity;

            const productTotal = product.unitPrice * product.quantity;
            const taxAmount = (taxDetails.rate / 100) * productTotal;

            total_amount_excl_tax += productTotal;
            total_tax_amount += taxAmount;
        }

        total_amount_incl_tax = total_amount_excl_tax + total_tax_amount;

        // Create the order
        const order = await Order.create({
            // total_amount_excl_tax,
            // total_tax_amount,
            // total_amount_incl_tax,
            total_amount,
            created_at: new Date()
        });

        // Add products to order
        await Promise.all(products.map(async product => {
            await OrderProduct.create({
                orderId: order.id,
                productId: product.productId,
                quantity: product.quantity,
                unitPrice: product.unitPrice
            });
        }));

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                order,
                total_amount_excl_tax,
                total_tax_amount,
                total_amount_incl_tax
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: error.message
        });
    }
});


// get order by id include the products
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: Product
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: error.message
        });
    }
});

// get all orders include the products
router.get('/', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: Product
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: orders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: error.message
        });
    }
});


module.exports = router;