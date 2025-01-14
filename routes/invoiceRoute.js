const express = require('express');
const router = express.Router();
const { Order, Product, OrderProduct, Tax, Category, Stock, Invoice, InvoiceProduct } = require('../models');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const logger = require('../logger');

const generateInpContent = (invoice) => {
    let content = '';
    const logicalNumber = 1;
    const paymentModeCode = invoice.payment_mode === 'Kesh' ? 0 : 3;

    // Loop through products to format them into the required lines
    invoice.products.forEach(product => {
        const { name, price } = product;
        const { quantity, discount_percentage, discount_price, tax_rate } = product.invoicesProduct;

        const line = `S,${logicalNumber},______,_,__;${name};${price.toFixed(2)};${quantity};1;1;5;0;${product.barcode};${discount_percentage};\n`;
        content += line;
    });

    content += `T,${logicalNumber},______,_,__;\n`;
    return content;
};

// get invoice by id with products and order
router.get('/:id', async (req, res) => {
    const invoiceId = req.params.id;

    try {

        if (!invoiceId) {
            logger.error('Invoice ID is required');
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Invoice ID is required'
            });
        }

        const invoice = await Invoice.findOne({
            where: { id: invoiceId },
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

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Generate the content
        const inpContent = generateInpContent(invoice);

        // const filePath = path.join(__dirname, `../invoices/invoice_${invoice.id}.inp`);
        // fs.writeFileSync(filePath, inpContent);
        const tempDir = "C:\\Temp";
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir); // Ensure the directory exists
        }

        const filePath = path.join(tempDir, `invoice_${invoice.id}.inp`);

        // Write the .inp file
        fs.writeFileSync(filePath, inpContent);

        console.log("File generated in path: ", filePath);

        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: "Invoice generated successfully.",
            invoice,
        })
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});

// get all invoices
router.get('/', async (req, res) => {
    try {

        let {
            page = 1,
            limit = 10,
            invoiceId,
            orderId,
            sortByDate,
            startDate,
            endDate
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        let whereClause = {};
        let totalInvoices;
        let orderClause = [];

        if (sortByDate === 'asc') {
            orderClause.push(['created_at', 'ASC']);
        } else if (sortByDate === 'desc') {
            orderClause.push(['created_at', 'DESC']);
        }

        if (invoiceId) {
            whereClause.id = invoiceId;
        }

        if (orderId) {
            whereClause.order_id = orderId;
        }

        if (startDate && endDate) {
            whereClause.created_at = {
                [Op.between]: [startDate, endDate]
            }
        }



        totalInvoices = await Invoice.count({
            where: whereClause,
            include: [
                {
                    model: Product,
                    through: InvoiceProduct
                },
                {
                    model: Order
                },
            ],
        });

        if (!invoiceId) {
            totalInvoices = await Invoice.count({
                where: whereClause,
            });
        };

        if (!orderId) {
            totalInvoices = await Invoice.count({
                where: whereClause,
            });
        }

        if (!startDate && !endDate) {
            totalInvoices = await Invoice.count({
                where: whereClause,
            });
        }

        const totalPages = Math.ceil(totalInvoices / limit);

        if (page > totalPages) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'No invoices found'
            });
        }


        const invoices = await Invoice.findAll({
            where: whereClause,
            include: [
                {
                    model: Product,
                    through: InvoiceProduct
                },
                {
                    model: Order
                },
            ],
            limit: limit,
            offset: (page - 1) * limit,
            order: orderClause
        });

        if (invoices.length === 0) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'No invoices found'
            });
        }

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                total: totalInvoices,
                page: page,
                limit: limit,
                invoices: invoices,
            }
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});

// router.get('/print/:id', (req, res) => {
//     const filePath = path.join(__dirname, `../invoices/invoice_${req.params.id}.inp`);

//     // Check if the .inp file exists
//     if (!fs.existsSync(filePath)) {
//         return res.status(404).json({ error: 'No .inp file found for this invoice' });
//     }

//     // Function to send the .inp file via serial port
//     const sendFileToPrinter = (filePath, res) => {
//         fs.readFile(filePath, (err, data) => {

//             if (err) {
//                 return res.status(500).json({ error: 'Failed to read .inp file' });
//             }

//             const port = new SerialPort(COM_PORT, { baudRate: BAUD_RATE });

//             port.on('open', () => {
//                 port.write(data, (err) => {
//                     if (err) {
//                         return res.status(500).json({ error: 'Failed to send file to printer' });
//                     }

//                     port.close();
//                     return res.status(200).json({ message: 'File sent to printer successfully' });
//                 });
//             });

//             port.on('error', (err) => {
//                 return res.status(500).json({ error: 'Failed to open serial port', details: err.message });
//             });

//         });
//     };

//     // Send the .inp file to the printer
//     sendFileToPrinter(filePath, res);
// });

module.exports = router;