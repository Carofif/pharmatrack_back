'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      this.belongsTo(models.Pharmacie, {
        foreignKey: 'pharmacieId',
        as: 'pharmacie',
        onDelete: 'CASCADE',
      });
    }
  }
  Utilisateur.init({
    nom: DataTypes.STRING,
    prenoms: DataTypes.STRING,
    sexe: DataTypes.STRING,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    motDePasse: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      values: ['aucun', 'pharmacien', 'employe', 'administrateur']
    },
    pharmacieId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  return Utilisateur;
};