const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const Product = require('./Product');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_DIALECT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
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

