'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Logs.init({
    id: DataTypes.STRING,
    action: DataTypes.STRING,
    url: DataTypes.STRING,
    role: DataTypes.STRING,
    req_obj: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Logs',
  });
  return Logs;
};