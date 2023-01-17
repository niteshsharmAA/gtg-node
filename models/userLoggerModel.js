const { DataTypes } = require('sequelize');

const request_logger = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID
        },
        req_method: {
            type: DataTypes.STRING
        },
        req_url: {
            type: DataTypes.STRING
        },
        response: {
            type: DataTypes.JSON
        },
        request_payload:{
            type: DataTypes.JSON
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

module.exports = request_logger;