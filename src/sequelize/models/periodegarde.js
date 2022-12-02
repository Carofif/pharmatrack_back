'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PeriodeGarde extends Model {
    static associate(models) {
      this.belongsToMany(models.Pharmacie, {
        foreignKey: "periodeGardeId",
        through: 'Gardes',
        as: "pharmacies",
      });
    }
  }
  PeriodeGarde.init({
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PeriodeGarde',
  });
  return PeriodeGarde;
};