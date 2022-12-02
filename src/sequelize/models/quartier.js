'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quartier extends Model {
    static associate(models) {
      this.belongsTo(models.Commune, {
        foreignKey: 'communeId',
        as: 'commune',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Pharmacie, {
        foreignKey: 'quartierId',
      });
    }
  }
  Quartier.init({
    nom: DataTypes.STRING,
    communeId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Quartier',
  });
  return Quartier;
};