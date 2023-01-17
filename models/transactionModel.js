const { DataTypes } = require('sequelize');

const TransactionsSchema = {
    schema: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      asset: {
        type: DataTypes.STRING
      },
      coinBps: {
        type: DataTypes.STRING
      },
      impactCoinBps: {
        type: DataTypes.STRING
  
      },
      coinValue: {
        type: DataTypes.STRING
  
      },
      impactCoinValue: {
        type: DataTypes.STRING
  
      },
      shareValue: {
        type: DataTypes.STRING
      },
      impactShareValue: {
        type: DataTypes.STRING
  
      },
      amount: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.STRING //one of 1( from spot to USDT-Ⓜ), 2( from USDT-Ⓜ to spot), 3( from spot to COIN-Ⓜ), and 4( from COIN-Ⓜ to spot)
      },
      timestamp: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING
      },
      tradeSellId: {
        type: DataTypes.INTEGER
      },
      tradeBuyId: {
        type: DataTypes.INTEGER
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
      }
    },
    options: {
        freezeTableName: true,
        timestamps: false
    },
};

module.exports = TransactionsSchema;


// module.exports = (sequelize, Sequelize) => {
//   const Transactions = sequelize.define("transactions", {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     asset: {
//       type: Sequelize.STRING
//     },
//     coinBps: {
//       type: Sequelize.STRING
//     },
//     impactCoinBps: {
//       type: Sequelize.STRING

//     },
//     coinValue: {
//       type: Sequelize.STRING

//     },
//     impactCoinValue: {
//       type: Sequelize.STRING

//     },
//     shareValue: {
//       type: Sequelize.STRING
//     },
//     impactShareValue: {
//       type: Sequelize.STRING

//     },
//     amount: {
//       type: Sequelize.STRING
//     },
//     type: {
//       type: Sequelize.STRING //one of 1( from spot to USDT-Ⓜ), 2( from USDT-Ⓜ to spot), 3( from spot to COIN-Ⓜ), and 4( from COIN-Ⓜ to spot)
//     },
//     timestamp: {
//       type: Sequelize.STRING
//     },
//     status: {
//       type: Sequelize.STRING
//     },
//     senderId: {
//       type: Sequelize.INTEGER
//     },
//     reciverId: {
//       type: Sequelize.INTEGER
//     },
//     createdAt: {
//       type: Sequelize.DATE,
//       allowNull: true,
//       defaultValue: Sequelize.NOW,
//     },
//     updatedAt: {
//       type: Sequelize.DATE,
//       allowNull: true,
//       defaultValue: Sequelize.NOW,
//     },
//   },
//     {
//       tableName: "transaction",
//     }
//   );
//   return Transactions;
// };
