'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Departements extends Model {
    static associate(models) {
      this.hasMany(models.Arrondissement, {
        foreignKey: 'departementId',
      });
    }
  }
  Departements.init({
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Departements',
  });
  return Departements;
};