const { DataTypes } = require('sequelize');

const faqSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING
        },
        answer: {
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

module.exports = faqSchema;