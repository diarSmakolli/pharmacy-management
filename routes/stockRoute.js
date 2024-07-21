const express = require('express');
const router = express.Router();
const { Partner, Product, Category, Tax, Stock } = require('../models');


// get product by id
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


module.exports = router;