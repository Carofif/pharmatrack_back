'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Utilisateurs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4')
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prenoms: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sexe: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      motDePasse: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM,
        values: ['aucun', 'pharmacien', 'employe', 'administrateur']
      },
      pharmacieId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Pharmacies',
          key: 'id',
          as: 'pharmacieId',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Utilisateurs');
  }
};