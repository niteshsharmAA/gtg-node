const { DataTypes } = require('sequelize');

const ticketConversationSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        tid: {
            type: DataTypes.UUID
        },
       
        message:{
            type: DataTypes.STRING    // conversation message
        },
        createdAt: {
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

module.exports = ticketConversationSchema;