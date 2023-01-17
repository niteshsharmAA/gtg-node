const { DataTypes } = require('sequelize');

const SessionSchema = {
    schema: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        uid: {
          type: DataTypes.INTEGER
        },
        uuid: {
            type: DataTypes.UUID
        },
        token: {
          type: DataTypes.STRING
        },
        session_id: {
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

module.exports = SessionSchema;