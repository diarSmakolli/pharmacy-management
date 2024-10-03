const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_DIALECT, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
})

const InvoiceProduct = sequelize.define('invoicesProduct', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_id: {
        type: Sequelize.DataTypes.INTEGER
    },
    product_id: {
        type: Sequelize.DataTypes.INTEGER
    },
    quantity: {
        type: Sequelize.DataTypes.INTEGER
    },
    unit_price: {
        type: Sequelize.DataTypes.DOUBLE
    },
    discount_percentage: {
        type: Sequelize.DataTypes.DOUBLE
    },
    discount_price: {
        type: Sequelize.DataTypes.DOUBLE
    },
    tax_rate: {
        type: Sequelize.DataTypes.DOUBLE
    },
    total_value: {
        type: Sequelize.DataTypes.DOUBLE
    }
}, {
    tableName: 'invoicesProduct',
    timestamps: false
});

module.exports = InvoiceProduct;

