'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commune extends Model {
    static associate(models) {
      this.belongsTo(models.Arrondissement, {
        foreignKey: 'arrondissementId',
        as: 'arrondissement',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Quartier, {
        foreignKey: 'communeId',
      });
    }
  }
  Commune.init({
    nom: DataTypes.STRING,
    arrondissementId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Commune',
  });
  return Commune;
};