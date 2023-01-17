const { DataTypes } = require('sequelize');

const ContactSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        contact_type: {
            type: DataTypes.STRING
        },
        contact_number: {
            type: DataTypes.BIGINT,
        },
        mail_id: {
            type: DataTypes.STRING,
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

module.exports = ContactSchema;