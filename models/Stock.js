const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const Product = require('./Product');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_DIALECT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
})

const Stock = sequelize.define('stocks', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: Sequelize.DataTypes.INTEGER
    },
    quantity: {
        type: Sequelize.DataTypes.INTEGER
    },
}, {
    tableName: 'stocks',
    timestamps: false
});

module.exports = Stock;

