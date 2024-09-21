const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DIALECT, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

const Invoice = sequelize.define('invoices', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    },
    total_amount: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    tax_amount: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: true
    },
    payment_mode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'invoices',
    timestamps: false
});

module.exports = Invoice;

