const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const Product = require('./Product');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_DIALECT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
})

const Partner = sequelize.define('partners', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.DataTypes.STRING
    },
    businessNumber: {
        type: Sequelize.DataTypes.STRING,
    },
    fiscalNumber: {
        type: Sequelize.DataTypes.STRING,
    },
    commune: {
        type: Sequelize.DataTypes.STRING,
    },
    address: {
        type: Sequelize.DataTypes.STRING,
    },
    status: {
        type: Sequelize.DataTypes.STRING,
    },
    phoneNumber: {
        type: Sequelize.DataTypes.STRING,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
    },
}, {
    tableName: 'partners',
    timestamps: false
});

module.exports = Partner;

