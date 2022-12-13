'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assurance extends Model {
    static associate(models) {
      this.belongsToMany(models.Pharmacie, {
        foreignKey: "assuranceId",
        through: 'PharmaAssurances',
        as: "pharmacies",
      });
    }
  }
  Assurance.init({
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Assurance',
  });
  return Assurance;
};