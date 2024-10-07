const express = require('express');
const router = express.Router();
const { Order, Product, OrderProduct, Tax, Category, Stock, Invoice, InvoiceProduct, Partner } = require('../models');
const { Op } = require('sequelize');
const logger = require('../logger');

router.post('/', async (req, res) => {
    const { products, overallDiscount } = req.body;

    logger.info("Request body: ", req.body);

    if(!products || products.length === 0) {
        logger.error('Nuk ka produkte në porosi!');
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Nuk ka produkte në porosi!'
        });
    } 

    try {

        let total_amount = 0;
        let total_taxAmount = 0;
        const orderProducts = [];

        for (const product of products) {

            if(!product.productId || !product.quantity) {
                logger.error('Produkti duhet të ketë ID dhe sasi!');
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Produkti duhet të ketë ID dhe sasi!'
                });
            }

            if(isNaN(product.productId) || isNaN(product.quantity)) {
                logger.error('ID dhe sasia duhet të jenë numra!');
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'ID dhe sasia duhet të jenë numra!'
                });
            }

            const productDetails = await Product.findByPk(product.productId, {
                include: [Tax, Category, Stock]
            });

            if (!productDetails) {
                logger.error(`Produkti me ID ${product.productId} nuk u gjet!`);
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: `Produkti me ID ${product.productId} nuk u gjet!`
                });
            }

            const { price: unitPrice } = productDetails;
            let productDiscountPercentage = product.discount || 0;

            if (productDiscountPercentage > 100) {
                logger.error('Ulja nuk mund te jete me e madhe se 100%!');
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Ulja nuk mund te jete me e madhe se 100%!'
                });
            }

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
                logger.error(`Stoku nuk u gjet për produktin me ID ${product.productId}`);
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Stoku nuk u gjet!'
                });
            }

            if (parseInt(stock.quantity) < parseInt(product.quantity)) {
                logger.error(`Nuk ka stock për produktin me ID ${product.productId}`);
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Nuk ka stock!'
                });
            }

            if (stock.quantity <= 0) {
                logger.error(`Nuk ka stock për produktin me ID ${product.productId}`);
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: `Nuk ka stock për produktin me ID ${product.productId}`
                });
            }

            stock.quantity -= product.quantity;
            await stock.save();

            logger.info(`Stoku u azhurnua me sukses për produktin me ID ${product.productId}`);

            orderProducts.push({
                productId: product.productId,
                quantity: product.quantity,
                unitPrice: unitPrice,
                discount: productDiscountPercentage,
                taxRate 
            });
        }

        if (overallDiscount) {
            total_amount -= (overallDiscount / 100) * total_amount;
        }

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
            payment_mode: 'Cash',
            created_at: new Date()
        });


        await Promise.all(orderProducts.map(async orderProduct => {
            const discountAmount = (orderProduct.discount / 100) * orderProduct.unitPrice;
            const discountedPrice = orderProduct.unitPrice - discountAmount; // Move this inside the map

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
        logger.error('error: ', error);
        console.log("ERRRRRRRR");
        console.log("ERR: ", error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'    
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [Invoice, Product]
        });

        if (!order) {
            logger.error('Porosia nuk u gjet!');
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Porosia nuk u gjet!'
            });
        }


        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: order,
        });
    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        });
    }
});

// get all orders include the products
router.get('/', async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            sortByDate,
            productId,
            startDate,
            endDate,
            minTotalAmount,
            maxTotalAmount,
            minQuantity,
            maxQuantity,
            orderId
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        let whereClause = {};
        let productWhereClause = {};
        let orderClause = [];

        let totalOrders;

        if (sortByDate === 'asc') {
            orderClause.push(['created_at', 'ASC']);
        } else if (sortByDate === 'desc') {
            orderClause.push(['created_at', 'DESC']);
        }


        if (productId) {
            productWhereClause.id = productId;
        }

        if (startDate && endDate) {
            whereClause.created_at = {
                [Op.between]: [new Date(startDate), new Date(endDate)] // Filtron sipas rangut të datave
            };
        }

        if (minTotalAmount && maxTotalAmount) {
            whereClause.total_amount = {
                [Op.between]: [minTotalAmount, maxTotalAmount]
            };
        }

        if (orderId) {
            whereClause.id = orderId;
        }

        let orderDetailsWhereClause = {};

        if (minQuantity && maxQuantity) {
            orderDetailsWhereClause.quantity = {
                [Op.between]: [parseInt(minQuantity), parseInt(maxQuantity)] // Filter by quantity range
            };
        } else if (minQuantity) {
            orderDetailsWhereClause.quantity = {
                [Op.gte]: parseInt(minQuantity) // Filter by minimum quantity
            };
        } else if (maxQuantity) {
            orderDetailsWhereClause.quantity = {
                [Op.lte]: parseInt(maxQuantity) // Filter by maximum quantity
            };
        }


        totalOrders = await Order.count({
            where: whereClause,
            include: [
                {
                    model: Invoice,
                },
                {
                    model: Product,
                    where: productWhereClause,
                    through: {
                        attributes: ['quantity', 'unitPrice'],
                        where: orderDetailsWhereClause
                    },
                    include: [
                        { model: Category },
                        { model: Partner },
                        { model: Tax },
                    ]
                },
            ]
        });

        if (!minQuantity && !maxQuantity) {
            totalOrders = await Order.count({
                where: whereClause,
            });
        }

        if (!minTotalAmount && !maxTotalAmount) {
            totalOrders = await Order.count({
                where: whereClause,
            });
        }

        if (!startDate && !endDate) {
            totalOrders = await Order.count({
                where: whereClause,
            });
        }


        const totalPages = Math.ceil(totalOrders / limit);

        if (page > totalPages) {
            logger.error(`Faqja ${page} nuk ekziston. Totali i faqeve është ${totalPages}.`);
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: `Faqja ${page} nuk ekziston. Totali i faqeve është ${totalPages}.`
            });
        }


        const orders = await Order.findAll({
            where: whereClause,
            include: [
                {
                    model: Invoice,
                },
                {
                    model: Product,
                    where: productWhereClause,
                    through: {
                        attributes: ['quantity', 'unitPrice'],
                        where: orderDetailsWhereClause
                    },
                    include: [
                        { model: Category },
                        { model: Partner },
                        { model: Tax },
                    ]
                },
            ],
            offset: (page - 1) * limit,
            limit: limit,
            order: orderClause,
        });

        if (orders.length === 0) {
            logger.error('Nuk u gjet asnjë porosi');
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'Nuk u gjet asnjë porosi',
            });
        }


        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                total: totalOrders,
                page,
                limit,
                totalPages,
                orders: orders,
            }
        });
    } catch (error) {
        logger.error('error: ', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        });
    }
});



module.exports = router;