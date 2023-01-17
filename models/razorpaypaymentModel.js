const { DataTypes } = require('sequelize');

const RazorpayPayment = {
    schema: {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receipt: {
            type: DataTypes.STRING,
        },
        notes: {
            type: DataTypes.STRING
        },
        payment_id: {
            type: DataTypes.STRING
        },
        signature: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING
        },
        partial_payment: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        message: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    options: {
        freezeTableName: true,
        timestamps: false
    },

}

module.exports = RazorpayPayment;