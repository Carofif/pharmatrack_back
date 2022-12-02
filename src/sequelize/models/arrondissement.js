'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Arrondissement extends Model {
    static associate(models) {
      this.belongsTo(models.Departements, {
        foreignKey: 'departementId',
        as: 'departements',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Commune, {
        foreignKey: 'arrondissementId',
      });
    }
  }
  Arrondissement.init({
    nom: DataTypes.STRING,
    departementId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Arrondissement',
  });
  return Arrondissement;
};