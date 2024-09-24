const express = require('express');
const router = express.Router();
const { Order, Product, OrderProduct, Tax, Category, Stock, Invoice, InvoiceProduct } = require('../models');

// get invoice by id with products and order
router.get('/:id', async (req, res) => {
    const invoice = await Invoice.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: Product,
                through: InvoiceProduct
            },
            {
                model: Order
            },

        ]
    });

    res.json(invoice);
});

module.exports = router;