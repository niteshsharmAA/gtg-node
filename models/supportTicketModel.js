const { DataTypes } = require('sequelize');

const supportTicketSchema = {
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
        ticketId: {
            type: DataTypes.UUID  ,     //ticket unique id
            defaultValue: DataTypes.UUIDV1
        },
        category: {
            type: DataTypes.STRING    //ticket category
        },
        subject:{
            type: DataTypes.STRING
        },
        message:{
            type: DataTypes.STRING    // message raise on ticket
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

module.exports = supportTicketSchema;