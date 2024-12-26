updated to fetch products:

router.get('/search', async (req, res) => {
    try {
        let { 
            // page = 1, 
            // limit = 10, 
            keyword 
        } = req.query;
        // page = parseInt(page);
        // limit = parseInt(limit);

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
            // offset: (page - 1) * limit,
            // limit: limit
        });

        res.status(200).json(products);
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'
        });
    }
});



UPDATED ORDER CREATION:
// right logic calculation of VAT
router.post('/', async (req, res) => {
    const { products, overallDiscount } = req.body;

    logger.info("Request body: ", req.body);

    if (!products || products.length === 0) {
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
            if (!product.productId || !product.quantity) {
                logger.error('Produkti duhet të ketë ID dhe sasi!');
                return res.status(400).json({
                    status: 'error',
                    statusCode: 400,
                    message: 'Produkti duhet të ketë ID dhe sasi!'
                });
            }

            if (isNaN(product.productId) || isNaN(product.quantity)) {
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

            const discountAmount = (productDiscountPercentage / 100) * unitPrice;
            const discountedPrice = unitPrice - discountAmount;
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
                where: { productId: product.productId }
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
            const discountedPrice = orderProduct.unitPrice - discountAmount;
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
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong!'    
        });
    }
});
