const { DataTypes } = require('sequelize');

const TransactionsFeesSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        currency: {
            type: DataTypes.STRING
        },
        amountStart: {
            type: DataTypes.INTEGER
        },
        amountEnd: {
            type: DataTypes.INTEGER
        },
        fees: {
            type: DataTypes.INTEGER

        },
        unit: {
            type: DataTypes.STRING

        },
        timestamp: {
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
        },
    },
    options: {
        freezeTableName: true,
        timestamps: false
    },
};

module.exports = TransactionsFeesSchema;
// module.exports = (sequelize, Sequelize) => {
//     const TransactionsFees = sequelize.define("transactionfees", {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         currency: {
//             type: Sequelize.STRING
//         },
//         amountStart: {
//             type: Sequelize.INTEGER
//         },
//         amountEnd: {
//             type: Sequelize.INTEGER
//         },
//         fees: {
//             type: Sequelize.INTEGER

//         },
//         unit: {
//             type: Sequelize.STRING

//         },
//         timestamp: {
//             type: Sequelize.INTEGER
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
//         tableName: "transactionFees",
//     }
//     );
//     return TransactionsFees;
// };
