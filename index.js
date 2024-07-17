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

const app = express();
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());


// DB connection
const sequelize = new Sequelize({
    dialect: process.env.DIALECT,
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error: ' + err));

// Routes
app.use('/api/users', userRoute);
app.use('/api/partners', partnerRoute);
app.use('/api/products', productRoute);

// Server

const port = 6099;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
