const express = require('express');
const router = express.Router();
const { Order, Product, OrderProduct, Tax, Category, Stock, Invoice, InvoiceProduct } = require('../models');
const path = require('path');
const fs = require('fs');
const SerialPort = require('serialport');

// Serial port configuration
const COM_PORT = 'COM3'; 
const BAUD_RATE = 19200; 

const generateInpContent = (invoice) => {
    let content = '';
    const logicalNumber = 1;
    const paymentModeCode = invoice.payment_mode === 'Kesh' ? 0 : 3;

    // Loop through products to format them into the required lines
    invoice.products.forEach(product => {
        const { name, price } = product;
        const { quantity, discount_percentage, discount_price, tax_rate } = product.invoicesProduct;

        // Format the article sale line2
        const line = `S,${logicalNumber},______,_,__;${name.padEnd(32)};${price.toFixed(2)};${quantity};1;1;${tax_rate};0;${product.barcode};${discount_percentage};${discount_price}\n`;
        content += line;
    });

    // Add the end of bill line
    content += `T,${logicalNumber},______,_,__;\n`;
    // Add the payment line
    content += `T,${logicalNumber},______,_,__;${paymentModeCode};${invoice.total_amount.toFixed(2)}\n`;

    return content;
};


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

    if(!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
    }

    // Generate the content
    const inpContent = generateInpContent(invoice);

    const filePath = path.join(__dirname, `../invoices/invoice_${invoice.id}.inp`);
    fs.writeFileSync(filePath, inpContent);

    console.log(filePath);

    res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: "Invoice generated successfully.",
        invoice,
        filePath
    })
});

router.get('/print/:id', (req, res) => {
    const filePath = path.join(__dirname, `../invoices/invoice_${req.params.id}.inp`);

    // Check if the .inp file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'No .inp file found for this invoice' });
    }

    // Function to send the .inp file via serial port
    const sendFileToPrinter = (filePath, res) => {
        fs.readFile(filePath, (err, data) => {

            if (err) {
                return res.status(500).json({ error: 'Failed to read .inp file' });
            }

            const port = new SerialPort(COM_PORT, { baudRate: BAUD_RATE });

            port.on('open', () => {
                port.write(data, (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to send file to printer' });
                    }

                    port.close();
                    return res.status(200).json({ message: 'File sent to printer successfully' });
                });
            });

            port.on('error', (err) => {
                return res.status(500).json({ error: 'Failed to open serial port', details: err.message });
            });
        
        });
    };

    // Send the .inp file to the printer
    sendFileToPrinter(filePath, res);
});

module.exports = router;