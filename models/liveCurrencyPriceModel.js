const { DataTypes } = require('sequelize');

const currencyPriceSchema = {
    schema: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      currencyname:{
        type: DataTypes.STRING
      },
      currencyprice: {
        type: DataTypes.INTEGER
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

module.exports = currencyPriceSchema;



// module.exports = (sequelize, Sequelize) => {
//     const currencyprice = sequelize.define("currencyprice", {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       currencyname:{
//         type: Sequelize.STRING
//       },
//       currencyprice: {
//         type: Sequelize.INTEGER
//       },
//     });
//     return currencyprice;
//   };