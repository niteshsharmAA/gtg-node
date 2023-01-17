const { DataTypes } = require('sequelize');

const swapSchema = {
    schema: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId:{
        type: DataTypes.STRING
      },
      uuid: {
          type: DataTypes.UUID
      },
      swapTime: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING
      },
      quoteasset: {
        type: DataTypes.STRING
      },
      baseasset: {
        type: DataTypes.STRING
      },
      fromcurrency: {
        type: DataTypes.FLOAT
      },
      tocurrency: {
        type: DataTypes.STRING
      },
      price: {
        type: DataTypes.FLOAT
      },
      fee: {
        type: DataTypes.FLOAT
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

module.exports = swapSchema;
// const { Converter } = require("aws-sdk/clients/dynamodb");

// module.exports = (sequelize, Sequelize) => {
//     const swapModel = sequelize.define("swaptrading", {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       userId:{
//         type: Sequelize.STRING
//       },
//       swapTime: {
//         type: Sequelize.STRING
//       },
//       status: {
//         type: Sequelize.STRING
//       },
//       quoteAsset: {
//         type: Sequelize.STRING
//       },
//       baseAsset: {
//         type: Sequelize.STRING
//       },
//       fromcurrency: {
//         type: Sequelize.INTEGER
//       },
//       tocurrency: {
//         type: Sequelize.STRING
//       },
//       price: {
//         type: Sequelize.INTEGER
//       },
//       fee: {
//         type: Sequelize.INTEGER
//       }
//     });
//     return swapModel;
//   };
