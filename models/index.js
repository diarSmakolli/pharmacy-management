const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

const Partner = require('./Partner');
const Product = require('./Product');
const Category = require('./Category');
const Tax = require('./Tax');
const Order = require('./Order');
const OrderProduct = require('./OrderProduct');
const Stock = require('./Stock');


// Set up associations
Partner.hasMany(Product, { foreignKey: 'partnerId' });
Product.belongsTo(Partner, { foreignKey: 'partnerId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Tax.hasMany(Product, { foreignKey: 'taxId' });
Product.belongsTo(Tax, { foreignKey: 'taxId' });

// Many to many relationship between Order and Product through OrderProduct
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId' });

Stock.belongsTo(Product, { foreignKey: 'productId' });
Product.hasOne(Stock, { foreignKey: 'productId' });


const models = {
    Partner,
    Product,
    Category,
    Tax,
    Order,
    OrderProduct,
    Stock,
    sequelize,
};

module.exports = models;

// const Partner = require('./Partner');
// const Product = require('./Product');

// // Set up associations
// Partner.hasMany(Product, { foreignKey: 'partnerId' });
// Product.belongsTo(Partner, { foreignKey: 'partnerId' });

// module.exports = { Partner, Product };
