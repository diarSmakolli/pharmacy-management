const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const Partner = require('./Partner');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

const Product = sequelize.define('products', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING
    },
    barcode: {
        type: Sequelize.DataTypes.STRING
    },
    description: {
        type: Sequelize.DataTypes.STRING
    },
    price: {
        type: Sequelize.DataTypes.DOUBLE
    },
    // discount: {
    //     type: Sequelize.DataTypes.INTEGER
    // },
    partnerId: {
        type: Sequelize.DataTypes.INTEGER,
    },
    status: {
        type: Sequelize.DataTypes.STRING
    },
    categoryId: {
        type: Sequelize.DataTypes.INTEGER
    },
    taxId: {
        type: Sequelize.DataTypes.INTEGER
    },
}, {
    tableName: 'products',
    timestamps: false
});

module.exports = Product;

