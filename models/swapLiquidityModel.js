const { DataTypes } = require('sequelize');

const swapLiquiditySchema = {
  schema: {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    poolId: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING
    },
    quoteAsset: {
      type: DataTypes.STRING
    },
    fromcurrency: {
      type: DataTypes.FLOAT
    },
    baseAsset: {
      type: DataTypes.STRING
    },
    tocurrency: {
      type: DataTypes.STRING
    },
    fee: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    shareamount: {
      type: DataTypes.STRING
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
    timestamps: true
  },
};

module.exports = swapLiquiditySchema;

// module.exports = (sequelize, Sequelize) => {
//     const swapLiquidity = sequelize.define("swapliquidity", {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       poolId: {
//         type: Sequelize.INTEGER
//       },
//       type: {
//         type: Sequelize.STRING
//       },
//       quoteAsset: {
//         type: Sequelize.STRING
//       },
//       fromcurrency: {
//         type: Sequelize.INTEGER
//       },
//       baseAsset: {
//         type: Sequelize.STRING
//       },
//       tocurrency: {
//         type: Sequelize.INTEGER
//       },
//       fee: {
//         type: Sequelize.STRING
//       },
//       status: {
//         type: Sequelize.STRING
//       },
//       shareamount: {
//         type: Sequelize.STRING
//       }
//     });
//     return swapLiquidity;
//   };