const { DataTypes } = require('sequelize');

const poolSchema = {
    schema: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      poolName: {
        type: DataTypes.STRING
      },
      assets: {
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
        timestamps: false
    },
};

module.exports = poolSchema;
// module.exports = (sequelize, Sequelize) => {
//     const pool = sequelize.define("pool", {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       poolName: {
//         type: Sequelize.STRING
//       },
//       assets: {
//         type: Sequelize.STRING
//       }
//     });
    
//     return pool;
//   };