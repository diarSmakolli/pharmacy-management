const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

const Partner = require('./Partner');
const Product = require('./Product');


// Set up associations
Partner.hasMany(Product, { foreignKey: 'partnerId' });
Product.belongsTo(Partner, { foreignKey: 'partnerId' });

const models = {
    Partner,
    Product,
    sequelize,
};

module.exports = models;

// const Partner = require('./Partner');
// const Product = require('./Product');

// // Set up associations
// Partner.hasMany(Product, { foreignKey: 'partnerId' });
// Product.belongsTo(Partner, { foreignKey: 'partnerId' });

// module.exports = { Partner, Product };
