const { DataTypes } = require('sequelize');

const currencySchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        currency: {
            type: DataTypes.STRING
        },
        currencyCountry: {
            type: DataTypes.STRING
        },
        baseValueInUSD: {
            type: DataTypes.STRING
        },
        unitValue: {
            type: DataTypes.STRING
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
        minAdd: {
            type: DataTypes.INTEGER
        },
        maxAdd: {
            type: DataTypes.INTEGER
        },
        minSwap: {
            type: DataTypes.INTEGER
        },
        maxSwap: {
            type: DataTypes.INTEGER
        },
    },
    options: {
        freezeTableName: true,
        timestamps: false
    },
};

module.exports = currencySchema;

// module.exports = (sequelize, Sequelize) => {
//     const currency = sequelize.define("currency", {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         currency: {
//             type: Sequelize.STRING
//         },
//         currencyCountry: {
//             type: Sequelize.STRING
//         },
//         baseValueInUSD: {
//             type: Sequelize.STRING
//         },
//         unitValue: {
//             type: Sequelize.STRING
//         },
//         createdAt: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
       
//         updatedAt: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     },
//     {
//         tableName: "currencies",
//     }
//     );
//     return currency
// }
