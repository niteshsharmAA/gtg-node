const { DataTypes } = require('sequelize');

const TradePairSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        coin_one : {
          type: DataTypes.STRING
        },
        coin_two : {
          type: DataTypes.STRING
        },
        coin_one_decimal : {
          type: DataTypes.FLOAT
        },
        coin_two_decimal : {
          type: DataTypes.FLOAT
        },
        type : {
          type: DataTypes.INTEGER
        },
        status : {
          type: DataTypes.INTEGER
        },
        bpsValue: {
          type: DataTypes.STRING
        },
      createdAt: {
        type: DataTypes.DATE
      },

      updatedAt: {
        type: DataTypes.DATE
      }
    },
    options: {
        freezeTableName: true,
        timestamps: false
    },
};

module.exports = TradePairSchema;
