const { DataTypes } = require('sequelize');

const CitySchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
          type: DataTypes.STRING
        },
        state_id: {
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

module.exports = CitySchema;
