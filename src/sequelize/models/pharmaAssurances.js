'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PharmaAssurance extends Model {
    static associate(models) {
      this.belongsTo(models.Pharmacie, {
        foreignKey: 'pharmacieId',
        as: 'pharmacie'
      });
      this.belongsTo(models.Assurance, {
        foreignKey: 'assuranceId',
        as: 'assurance'
      });
    }
  }
  PharmaAssurance.init({
    pharmacieId: DataTypes.UUID,
    assuranceId: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'PharmaAssurance',
  });
  return PharmaAssurance;
};