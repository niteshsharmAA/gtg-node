const { DataTypes } = require('sequelize');

const userProfileSchema = {
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
      fullName: {
        type: DataTypes.STRING
      },
      dob: {
        type: DataTypes.STRING
      },
      pancard: {
        type: DataTypes.STRING
      },
      country_id: {
        type: DataTypes.STRING
      },
      pincode: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      address: {
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

module.exports = userProfileSchema;

// module.exports = (sequelize, Sequelize) => {
//     const userProfile = sequelize.define("user_profile", {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//       },
//       uid: {
//         type: Sequelize.INTEGER
//       },
//       fullName: {
//         type: Sequelize.STRING
//       },
//       dob: {
//         type: Sequelize.STRING
//       },
//       pancard: {
//         type: Sequelize.STRING
//       },
//       country_id: {
//         type: Sequelize.INTEGER
//       },
//       pincode: {
//         type: Sequelize.STRING
//       },
//       city: {
//         type: Sequelize.STRING
//       },
//       address: {
//         type: Sequelize.STRING
//       },

//     });
  
//     return userProfile;
//   };