const { DataTypes } = require('sequelize');

const FutureBuyTradeSchema = {
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
        tradepair_id: {
          type: DataTypes.INTEGER
        },
        symbol: {
          type: DataTypes.STRING
        },
        trade_id: {
          type: DataTypes.STRING
        },
        marginal_type: {
          type: DataTypes.STRING
        },
        trade_type: {
          type: DataTypes.INTEGER
        },
        status: {
          type: DataTypes.INTEGER 
        },
        price: {
          type: DataTypes.DOUBLE
        },
        quantity: {
          type: DataTypes.DOUBLE
        },
        trade_total_value: {
          type: DataTypes.DOUBLE
        },
        commission: {
          type: DataTypes.DOUBLE
        },
        after_commission_total: {
          type: DataTypes.DOUBLE
        },
        executed_quantity: {
          type: DataTypes.DOUBLE
        },
        remaining_amount: {
          type: DataTypes.DOUBLE
        },
        stop_loss_price: {
          type: DataTypes.DOUBLE
        },
        target_price: {
          type: DataTypes.DOUBLE
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

module.exports = FutureBuyTradeSchema;
