const { DataTypes } = require('sequelize');

const CountrySchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        shortname: {
          type: DataTypes.STRING
        },
        name: {
          type: DataTypes.STRING
        },
        phonecode: {
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

module.exports = CountrySchema;