const { DataTypes } = require('sequelize');

const spotSellTradeSchema = {
  schema: {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER
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
    trade_type: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.FLOAT
    },
    quantity: {
      type: DataTypes.FLOAT
    },
    trade_total_value: {
      type: DataTypes.FLOAT
    },
    commission: {
      type: DataTypes.FLOAT
    },
    after_commission_total: {
      type: DataTypes.FLOAT
    },
    executed_quantity: {
      type: DataTypes.FLOAT
    },
    remaining_amount: {
      type: DataTypes.FLOAT
    },
    stop_loss_price: {
      type: DataTypes.FLOAT
    },
    target_price: {
      type: DataTypes.FLOAT
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

module.exports = spotSellTradeSchema;
// module.exports = (sequelize, Sequelize) => {
//     const spotselltrade = sequelize.define('spotselltrade',{
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//           },
//           uid: {
//             type: Sequelize.INTEGER
//           },
//           tradepair_id: {
//             type: Sequelize.INTEGER
//           },
//           trade_id: {
//             type: Sequelize.STRING
//           },
//           trade_type: {
//             type: Sequelize.INTEGER
//           },
//           status: {
//             type: Sequelize.INTEGER 
//           },
//           price: {
//             type: Sequelize.FLOAT
//           },
//           quantity: {
//             type: Sequelize.FLOAT
//           },
//           trade_total_value: {
//             type: Sequelize.FLOAT
//           },
//           commission: {
//             type: Sequelize.FLOAT
//           },
//           after_commission_total: {
//             type: Sequelize.FLOAT
//           },
//           remaining_quantity: {
//             type: Sequelize.FLOAT
//           },
//           remaining_amount: {
//             type: Sequelize.FLOAT
//           },
//           stop_loss_price: {
//             type: Sequelize.FLOAT
//           },
//           target_price: {
//             type: Sequelize.FLOAT
//           },

//     })
//     return spotselltrade
// }