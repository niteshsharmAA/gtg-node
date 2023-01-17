const { DataTypes } = require('sequelize');

const SellTradeSchema = {
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
        trade_id: {
          type: DataTypes.STRING
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
        remaining_quantity: {
          type: DataTypes.DOUBLE
        },
        remaining_amount: {
          type: DataTypes.DOUBLE
        },
        status: {
          type: DataTypes.INTEGER 
        },
        stop_loss_price: {
          type: DataTypes.DOUBLE
        },
        target_price: {
          type: DataTypes.DOUBLE
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

module.exports = SellTradeSchema;
