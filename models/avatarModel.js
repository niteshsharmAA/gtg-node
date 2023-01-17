const { DataTypes } = require('sequelize');

const AvatarSchema = {
    schema: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      url: {
        type: DataTypes.TEXT
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

module.exports = AvatarSchema;

// module.exports = (sequelize, Sequelize) => {
//     const Avatars = sequelize.define("avatars", {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       url: {
//         type: Sequelize.TEXT
//       },
//       createdAt: {
//         type: Sequelize.DATE
//       },  
//       updatedAt: {
//         type: Sequelize.DATE
//       }
//     });
  
//     return Avatars;
//   };