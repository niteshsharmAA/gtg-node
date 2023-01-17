const { DataTypes } = require('sequelize');

const DocumentSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        uid: {
          type: DataTypes.INTEGER
        },

        uuid: {
            type: DataTypes.UUID
        },
        type: {
          type: DataTypes.STRING
        },
        name: {
          type: DataTypes.STRING
        },
        doc_image: {
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

module.exports = DocumentSchema;