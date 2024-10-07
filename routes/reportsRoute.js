const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Tax = require('../models/Tax');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Stock = require('../models/Stock');
const Invoice = require('../models/Invoice');
const InvoiceProduct = require('../models/InvoiceProduct');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');


// total sales - done
router.get('/totalsales', async (req, res) => {
    try {
        const totalRevenue = await Invoice.sum("total_amount");

        

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalSales: totalRevenue 
        });

    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching total sales'
        });
    }
});

// total invoices - done
router.get('/totalinvoices', async (req, res) => {
    try {
        const totalInvoices = await Invoice.count();

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalInvoices: totalInvoices
        });

    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching total invoices'
        });
    }
});

// total number of products sold - done
router.get('/totalproductsold', async (req, res) => {
    try {
        const totalProductsSold = await OrderProduct.sum("quantity");

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalProductsSold
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching total products sold'
        });
    }
});

// revenue by month
router.get('/revenuebymonth', async (req, res) => {
    try {
        const revenueByMonth = await Invoice.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalRevenue'],
            ],
            group: 'month',
            order: [['month', 'ASC']],
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            revenueByMonth
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching revenue by month'
        });
    }
});

// total taxes - done
router.get('/totaltaxes', async (req, res) => {
    try {
        const totalTaxes = await Invoice.sum("tax_amount");

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalTaxes
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching total taxes collected'
        });
    }
});

// total products in stock - done
router.get('/totalproductsinstock', async (req, res) => {
    try {
        const totalProductsInStock = await Stock.sum("quantity");

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalProductsInStock
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching total products in stock'
        });
    }
});

// most sold products - new component - done
router.get('/mostsoldproducts', async (req, res) => {
    try {
        const mostSoldProducts = await OrderProduct.findAll({
            attributes: [
                'productId',
                [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold'],
                'product.id',     // Shtoni këto
                'product.name',   // Shtoni këto
                'product.price',  // Shtoni këto
                'product.description' // Shtoni këto
            ],
            group: ['productId', 'product.id', 'product.name', 'product.price', 'product.description'], // Shtoni këto
            order: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'DESC']],
            limit: 10,
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'price', 'description'], // Shtoni fushat që dëshironi të merrni
                    as: 'product' // Përdorni alias-in e saktë
                }
            ]
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            mostSoldProducts: mostSoldProducts.map(item => ({
                productId: item.productId,
                totalSold: item.getDataValue('totalSold'),
                productDetails: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    description: item.product.description,
                }
            }))
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching most sold products'
        });
    }
});

// total products - done
router.get('/total-products', async(req, res) => {
    try {

        const tp = await Product.count();

        res.status(200).json({
            status: 'error',
            statusCode: 200,
            totalProducts: tp
        })

    } catch(error) {
        console.log("err: ", error);
    }
});

// total partners - done
router.get('/total-partners', async(req, res) => {
    try {

        const tp = await Partner.count();

        res.status(200).json({
            status: 'error',
            statusCode: 200,
            totalPartners: tp
        })

    } catch(error) {
        console.log("err: ", error);
    }
});

// total orders - done
router.get('/total-orders', async(req, res) => {
    try {

        const tp = await Order.count();

        res.status(200).json({
            status: 'error',
            statusCode: 200,
            totalOrders: tp
        })

    } catch(error) {
        console.log("err: ", error);
    }
});

// sales growth 
router.get('/salesgrowth', async (req, res) => {
    try {
        const salesGrowth = await Invoice.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalSales']
            ],
            group: 'month',
            order: [['month', 'ASC']]
        });

        const growthData = salesGrowth.map((item, index) => {
            const currentMonthSales = item.getDataValue('totalSales');
            const previousMonthSales = index > 0 ? salesGrowth[index - 1].getDataValue('totalSales') : 0;
            const growth = previousMonthSales ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : null;

            return {
                month: item.getDataValue('month'),
                totalSales: currentMonthSales,
                growthPercentage: growth
            };
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            salesGrowth: growthData
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching sales growth'
        });
    }
});

// low stock - new component
router.get('/lowstock', async (req, res) => {
    const lowStockThreshold = 20;

    try {
        const lowStockProducts = await Stock.findAll({
            where: {
                quantity: {
                    [Op.lt]: lowStockThreshold 
                }
            },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'price'] 
                }
            ]
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            lowStockProducts: lowStockProducts.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity
            }))
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching low stock products'
        });
    }
});

// daily sales
router.get('/dailysales', async (req, res) => {
    try {
        const dailySales = await Invoice.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('created_at')), 'day'],
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalSales']
            ],
            group: 'day',
            order: [['day', 'ASC']]
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            dailySales
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching daily sales'
        });
    }
});

router.get('/weeklysales', async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // Saturday

        const weeklySales = await Invoice.findAll({
            where: {
                created_at: {
                    [Op.between]: [startOfWeek, endOfWeek],
                },
            },
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalSales'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalInvoices'],
            ],
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            weeklySales: weeklySales[0], // Return the first object
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching weekly sales report'
        });
    }
});

router.get('/monthlysales', async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

        const monthlySales = await Invoice.findAll({
            where: {
                created_at: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalSales'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalInvoices'],
            ],
        });

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            monthlySales: monthlySales[0], // Return the first object
        });
    } catch (error) {
        console.log("err: ", error);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Error fetching monthly sales report'
        });
    }
});

router.get('/metrics/sales-monthly-growth', async (req, res) => {
    try {
        const salesGrowth = await Invoice.findAll({
            attributes: [
                [sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "created_at"')), 'year'], // Extract year from created_at
                [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "created_at"')), 'month'], // Extract month from created_at
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalSales'] // Sum of total_amount for each month
            ],
            group: ['year', 'month'], // Group by year and month
            order: [
                [sequelize.literal('EXTRACT(YEAR FROM "created_at")'), 'ASC'],
                [sequelize.literal('EXTRACT(MONTH FROM "created_at")'), 'ASC']
            ] // Order by year and month
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            monthlySalesGrowth: salesGrowth
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Unable to fetch monthly sales growth data.',
            error: error.message // Provide additional error details
        });
    }
});

router.get('/metrics/sales-weekly-growth', async (req, res) => {
    try {
        const salesGrowth = await Invoice.findAll({
            attributes: [
                [sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "created_at"')), 'year'], // Extract year from created_at
                [sequelize.fn('EXTRACT', sequelize.literal('WEEK FROM "created_at"')), 'week'], // Extract week number from created_at
                [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalSales'], // Sum of total_amount for each week
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'] // Add full date
            ],
            group: [
                sequelize.literal('EXTRACT(YEAR FROM "created_at")'), // Group by year
                sequelize.literal('EXTRACT(WEEK FROM "created_at")'), // Group by week
                sequelize.literal('DATE("created_at")') // Group by date
            ],
            order: [
                [sequelize.literal('EXTRACT(YEAR FROM "created_at")'), 'ASC'],
                [sequelize.literal('EXTRACT(WEEK FROM "created_at")'), 'ASC']
            ] // Order by year and week
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            weeklyGrowthSales: salesGrowth
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Unable to fetch weekly sales growth data.',
            error: error.message // Provide additional error details
        });
    }
});

// total revenue today
router.get('/revenue-today', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const totalRevenueToday = await Invoice.sum('total_amount', {
            where: {
                created_at: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalRevenueToday
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Unable to fetch total revenue for today.',
            error: error.message // Provide additional error details
        });
    }
});

// total revenue this week
router.get('/revenue-this-week', async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // Saturday

        const totalRevenueThisWeek = await Invoice.sum('total_amount', {
            where: {
                created_at: {
                    [Op.between]: [startOfWeek, endOfWeek]
                }
            }
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalRevenueThisWeek
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Unable to fetch total revenue for this week.',
            error: error.message // Provide additional error details
        });
    }
});

// revenue last month
router.get('/revenue-last-month', async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        const totalRevenueLastMonth = await Invoice.sum('total_amount', {
            where: {
                created_at: {
                    [Op.between]: [startOfMonth, endOfMonth]
                }
            }
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            totalRevenueLastMonth
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong'
        });
    }
});


module.exports = router;