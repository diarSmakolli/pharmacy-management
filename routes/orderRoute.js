const express = require('express');
const router = express.Router();
const { Order, Product, OrderProduct, Tax, Category, Stock, Invoice, InvoiceProduct } = require('../models');


// router.post('/', async (req, res) => {
//     const { products, overallDiscount } = req.body;

//     try {
//         let total_amount = 0;
//         let total_taxAmount = 0;

//         const orderProducts = [];

//         for (const product of products) {
//             const productDetails = await Product.findByPk(product.productId, {
//                 include: [Tax, Category, Stock]
//             });

//             if (!productDetails) {
//                 return res.status(400).json({
//                     status: 'error',
//                     statusCode: 400,
//                     message: `Product with ID ${product.productId} not found`
//                 });
//             }

//             const { price: unitPrice } = productDetails;
//             const productDiscountPercentage = product.discount || 0;

//             // Calculate the discount amount based on the percentage
//             const discountAmount = (productDiscountPercentage / 100) * unitPrice;
//             const discountedPrice = unitPrice - discountAmount;

//             // Log values for debugging
//             console.log(`Product ID: ${product.productId}, Unit Price: ${unitPrice}, Discount Percentage: ${productDiscountPercentage}, Discount Amount: ${discountAmount}, Discounted Price: ${discountedPrice}`);

//             // Calculate total for this product
//             const productTotal = discountedPrice * product.quantity;

//             // Log product total
//             console.log(`Product Total for ID ${product.productId}: ${productTotal}`);

//             total_amount += productTotal;

//             let taxes = productDetails.tax;

//             if (taxes) {
//                 const productTaxAmount = (taxes.rate / 100) * productTotal;
//                 total_taxAmount += productTaxAmount;
//             }

//             const stock = await Stock.findOne({
//                 where: {
//                     productId: product.productId
//                 }
//             });

//             if (!stock) {
//                 return res.status(400).json({
//                     status: 'error',
//                     statusCode: 400,
//                     message: 'Stock not found'
//                 });
//             }

//             if (stock.quantity < product.quantity) {
//                 return res.status(400).json({
//                     status: 'error',
//                     statusCode: 400,
//                     message: 'Not enough stock'
//                 });
//             }

//             stock.quantity -= product.quantity;
//             await stock.save();

//             orderProducts.push({
//                 productId: product.productId,
//                 quantity: product.quantity,
//                 unitPrice: unitPrice,
//                 discount: productDiscountPercentage
//             });
//         }

//         // Apply overall discount if provided (as a percentage)
//         if (overallDiscount) {
//             total_amount -= (overallDiscount / 100) * total_amount;
//             console.log(`Overall Discount Applied: ${overallDiscount}%`);
//         }

//         // Ensure total_amount is not negative
//         total_amount = Math.max(total_amount, 0);

//         const order = await Order.create({
//             total_amount,
//             total_taxAmount,
//             created_at: new Date()
//         });

//         await Promise.all(orderProducts.map(async orderProduct => {
//             await OrderProduct.create({
//                 orderId: order.id,
//                 productId: orderProduct.productId,
//                 quantity: orderProduct.quantity,
//                 unitPrice: orderProduct.unitPrice,
//                 discount: orderProduct.discount
//             });
//         }));

        

//         return res.status(201).json({
//             status: 'success',
//             statusCode: 201,
//             data: {
//                 order,
//                 total_amount,
//                 total_taxAmount,
//                 invoice
//             }
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


// router.post('/', async (req, res) => {
//     const { products } = req.body;

//     try {
//         // Initialize variables for calculations
//         let total_amount = 0;
//         let total_taxAmount = 0;
//         let taxRate = 0;
//         let productDetails;

//         // Loop through products to calculate amounts
//         for (const product of products) {
//             productDetails = await Product.findByPk(product.productId, {
//                 include: [Tax, Category, Stock]
//             });

//             if (!productDetails) {
//                 return res.status(400).json({
//                     status: 'error',
//                     statusCode: 400,
//                     message: `Product with ID ${product.productId} not found`
//                 });
//             }

//             const { price: unitPrice, discount } = productDetails;

//             // calculate the discount price
//             const discountedPrice = unitPrice - (discount || 0); 

//             const stock = productDetails.stock;

//             if (!stock) {
//                 return res.status(400).json({
//                     status: 'error',
//                     statusCode: 400,
//                     message: 'Stock not found'
//                 });
//             }

//             // Calculate product total using stock quantity
//             const productTotal = discountedPrice * stock.quantity;
//             total_amount += productTotal;

//             // Get tax rate and calculate tax amount
//             taxRate = productDetails.tax.rate;
//             const productTaxAmount = (taxRate / 100) * productTotal;
//             total_taxAmount += productTaxAmount;

//             // Check if there is enough stock for the order
//             if (stock.quantity <= 0) {
//                 return res.status(400).json({
//                     status: 'error',
//                     statusCode: 400,
//                     message: `Not enough stock for product with ID ${product.productId}`
//                 });
//             }

//             // Reduce the stock quantity after processing the order
//             stock.quantity -= stock.quantity;
//             await stock.save();
//         }

//         // Create order
//         const order = await Order.create({
//             total_amount,
//             total_taxAmount,
//             created_at: new Date()
//         });

//         // Add products to the order
//         await Promise.all(products.map(async product => {
//             const productDetails = await Product.findByPk(product.productId);
//             await OrderProduct.create({
//                 orderId: order.id,
//                 productId: product.productId,
//                 quantity: productDetails.stock.quantity, // Save the stock quantity
//                 unitPrice: productDetails.price,
//                 discount: productDetails.discount
//             });
//         }));

//         // Return the successful order response
//         return res.status(201).json({
//             status: 'success',
//             statusCode: 201,
//             data: {
//                 order,
//                 total_amount,
//                 total_taxAmount,
//                 taxRate,
//                 productDetails
//             }
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



// get order by id include the products


router.post('/', async (req, res) => {
    const { products, overallDiscount } = req.body;

    try {
        let total_amount = 0;
        let total_taxAmount = 0;

        const orderProducts = [];

        for (const product of products) {
            const productDetails = await Product.findByPk(product.productId, {
                include: [Tax, Category, Stock]
            });

            if (!productDetails) {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: `Product with ID ${product.productId} not found`
                });
            }

            const { price: unitPrice } = productDetails;
            const productDiscountPercentage = product.discount || 0;

            // Calculate the discount amount based on the percentage
            const discountAmount = (productDiscountPercentage / 100) * unitPrice;
            const discountedPrice = unitPrice - discountAmount;

            // Calculate total for this product
            const productTotal = discountedPrice * product.quantity;

            total_amount += productTotal;

            let taxes = productDetails.tax;
            let taxRate = 0;

            if (taxes) {
                const productTaxAmount = (taxes.rate / 100) * productTotal;
                total_taxAmount += productTaxAmount;
                taxRate = taxes.rate; 
            }

            const stock = await Stock.findOne({
                where: {
                    productId: product.productId
                }
            });

            if (!stock) {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Stock not found'
                });
            }

            if (stock.quantity < product.quantity) {
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Not enough stock'
                });
            }

            stock.quantity -= product.quantity;
            await stock.save();

            orderProducts.push({
                productId: product.productId,
                quantity: product.quantity,
                unitPrice: unitPrice,
                discount: productDiscountPercentage,
                taxRate // Store the tax rate in the orderProducts array
            });
        }

        // Apply overall discount if provided (as a percentage)
        if (overallDiscount) {
            total_amount -= (overallDiscount / 100) * total_amount;
        }

        // Ensure total_amount is not negative
        total_amount = Math.max(total_amount, 0);

        const order = await Order.create({
            total_amount,
            total_taxAmount,
            created_at: new Date()
        });

        await Promise.all(orderProducts.map(async orderProduct => {
            await OrderProduct.create({
                orderId: order.id,
                productId: orderProduct.productId,
                quantity: orderProduct.quantity,
                unitPrice: orderProduct.unitPrice,
                discount: orderProduct.discount
            });
        }));

        const invoice = await Invoice.create({
            order_id: order.id,
            total_amount,
            tax_amount: total_taxAmount,
            payment_mode: 'pending', // Adjust as needed
            created_at: new Date()
        });
        

        // Add invoice products
        await Promise.all(orderProducts.map(async orderProduct => {
            // orderProduct.discount is an percentage discount value calculate then to discount amount in price
            const discountAmount = (orderProduct.discount / 100) * orderProduct.unitPrice;
            const discountedPrice = orderProduct.unitPrice - discountAmount; // Move this inside the map

            // Calculate total value for the product
            const productTotalValue = discountedPrice * orderProduct.quantity;            
        
            await InvoiceProduct.create({
                invoice_id: invoice.id,
                product_id: orderProduct.productId,
                quantity: orderProduct.quantity,
                unit_price: orderProduct.unitPrice,
                discount_percentage: orderProduct.discount,
                discount_price: discountAmount,
                tax_rate: orderProduct.taxRate || 0,
                total_value: productTotalValue
            });
        }));

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                order,
                total_amount,
                total_taxAmount,
                invoice
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




router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [Product, Invoice]
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