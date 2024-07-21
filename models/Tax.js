const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const Product = require('./Product');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

const Tax = sequelize.define('taxes', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING
    },
    rate: {
        type: Sequelize.DataTypes.INTEGER
    },
}, {
    tableName: 'taxes',
    timestamps: false
});

module.exports = Tax;

