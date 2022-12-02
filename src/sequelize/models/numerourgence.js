'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NumeroUrgence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  NumeroUrgence.init({
    nom: DataTypes.STRING,
    description: DataTypes.STRING,
    adresse: DataTypes.STRING,
    services: DataTypes.STRING,
    telephone: DataTypes.STRING,
    telephones: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'NumeroUrgence',
  });
  return NumeroUrgence;
};