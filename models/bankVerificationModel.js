const { DataTypes } = require('sequelize');

const BankVerificationSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        uuid: {
            type: DataTypes.UUID
        },
        accountNumber: {
            type: DataTypes.INTEGER
        },
        beneficiaryName: {
            type: DataTypes.STRING    //account holder name
        },
        ifscCode:{
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
};

module.exports = BankVerificationSchema;