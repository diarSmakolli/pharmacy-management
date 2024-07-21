const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const Product = require('./Product');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
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

