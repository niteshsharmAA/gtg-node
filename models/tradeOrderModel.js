const { DataTypes } = require('sequelize');

const tradeOrderSchema = {
  schema: {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID
    },
    symbol1: {
      type: DataTypes.STRING
    },
    symbol2: {
      type: DataTypes.STRING
    },
    trade_id: {
      type: DataTypes.STRING
    },
    order_type: {
      type: DataTypes.STRING
    },
    trade_type: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    complete: {
      type: DataTypes.BOOLEAN
    },
    price: {
      type: DataTypes.FLOAT
    },
    amount: {
      type: DataTypes.FLOAT
    },
    pending_amount: {
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

module.exports = tradeOrderSchema;
// module.exports = (sequelize, Sequelize) => {
//     const spotbuytrade = sequelize.define('spotbuytrade',{
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
//     return spotbuytrade
// }