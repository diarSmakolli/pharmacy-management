const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const path = require('path');
const userRoute = require('./routes/userRoute');
const partnerRoute = require('./routes/partnerRoute');
const productRoute = require('./routes/productRoute');
const categoryRoute = require('./routes/categoryRoute');
const taxRoute = require('./routes/taxRoute');
const orderRoute = require('./routes/orderRoute');
const stockRoute = require('./routes/stockRoute');
const invoiceRoute = require('./routes/invoiceRoute');

const app = express();
dotenv.config();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// DB connection
const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error: ' + err));

// Routes
app.use('/api/users', userRoute);
app.use('/api/partners', partnerRoute);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/taxes', taxRoute);
app.use('/api/orders', orderRoute);
app.use('/api/stocks', stockRoute); 
app.use('/api/invoices', invoiceRoute);

// Server

const port = 6099;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
