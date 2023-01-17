const { DataTypes } = require('sequelize');

const AddressSchema = {
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
        d_no: {
          type: DataTypes.STRING
        },
        address_1: {
          type: DataTypes.STRING
        },
        address_2: {
          type: DataTypes.STRING
        },
        address_3: {
          type: DataTypes.STRING
        },
        dist: {
          type: DataTypes.INTEGER
        },
        pincode: {
          type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
    },
    options: {
        freezeTableName: true,
        timestamps: false
    },
};

module.exports = AddressSchema;