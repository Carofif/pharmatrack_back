'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Garde extends Model {
    static associate(models) {
      this.belongsTo(models.Pharmacie, {
        foreignKey: 'pharmacieId',
        as: 'pharmacie'
      });
      this.belongsTo(models.PeriodeGarde, {
        foreignKey: 'periodeGardeId',
        as: 'periodeGarde'
      });
    }
  }
  Garde.init({
    pharmacieId: DataTypes.UUID,
    periodeGardeId: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Garde',
  });
  return Garde;
};