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
      this.belongsToMany(models.Assurance, {
        foreignKey: "pharmacieId",
        through: 'PharmaAssurances',
        as: "assurances",
      });
      this.hasMany(models.Utilisateur, {
        foreignKey: 'pharmacieId',
      });
    }
  }
  Pharmacie.init({
    nom: DataTypes.STRING,
    nomProprietaire: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    ouvertToutTemps: DataTypes.BOOLEAN,
    heureOuverture: DataTypes.TIME,
    heureFermeture: DataTypes.TIME,
    quartierId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Pharmacie',
  });
  return Pharmacie;
};