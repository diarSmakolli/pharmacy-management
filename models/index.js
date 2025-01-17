const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_DIALECT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
})

const Partner = require('./Partner');
const Product = require('./Product');
const Category = require('./Category');
const Tax = require('./Tax');
const Order = require('./Order');
const OrderProduct = require('./OrderProduct');
const Stock = require('./Stock');
const Invoice = require('./Invoice');
const InvoiceProduct = require('./InvoiceProduct');


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

Invoice.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasOne(Invoice, { foreignKey: 'order_id' });

Invoice.belongsToMany(Product, { through: InvoiceProduct, foreignKey: 'invoice_id' });
Product.belongsToMany(Invoice, { through: InvoiceProduct, foreignKey: 'product_id' });

OrderProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
OrderProduct.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// InvoiceProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
// InvoiceProduct.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

const models = {
    Partner,
    Product,
    Category,
    Tax,
    Order,
    OrderProduct,
    Stock,
    sequelize,
    Invoice,
    InvoiceProduct,
};

module.exports = models;
