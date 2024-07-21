const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

const Order = sequelize.define('orders', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true
    },
    total_amount: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
}, {
    tableName: 'orders',
    timestamps: false
});

module.exports = Order;

