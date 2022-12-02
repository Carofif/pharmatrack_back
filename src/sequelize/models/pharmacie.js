'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pharmacie extends Model {
    static associate(models) {
      this.belongsTo(models.Quartier, {
        foreignKey: 'quartierId',
        as: 'quartier',
        onDelete: 'CASCADE',
      });
      this.belongsToMany(models.PeriodeGarde, {
        foreignKey: "pharmacieId",
        through: 'Gardes',
        as: "periodeGardes",
      });
    }
  }
  Pharmacie.init({
    nom: DataTypes.STRING,
    nomProprietaire: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    ouvertToutTemps: DataTypes.BOOLEAN,
    heureOuverture: DataTypes.DATE,
    heureFermeture: DataTypes.DATE,
    quartierId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Pharmacie',
  });
  return Pharmacie;
};