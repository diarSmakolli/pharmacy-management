const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const { ref } = require('pdfkit');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_DIALECT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
})

const OrderProduct = sequelize.define('order_details', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    productId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: Sequelize.DataTypes.INTEGER
    },
    unitPrice: {
        type: Sequelize.DataTypes.DOUBLE
    }
}, {
    modelName: 'OrderProduct',
    tableName: 'order_details',
    timestamps: false
});

module.exports = OrderProduct;

