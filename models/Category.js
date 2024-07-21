const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const Product = require('./Product');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

const Category = sequelize.define('categories', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING
    },
}, {
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;

