const { DataTypes } = require('sequelize');

const VerificationSchema = {
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
        doc_type: {
          type: DataTypes.STRING
        },
        doc_image: {
          type: DataTypes.STRING
        },
        doc_image1:{
            type: DataTypes.STRING
        },
        doc_name: {
          type: DataTypes.STRING
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

module.exports = VerificationSchema;
