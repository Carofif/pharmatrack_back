'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Arrondissements', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4')
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      departementId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Departements',
          key: 'id',
          as: 'departementId',
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
    await queryInterface.dropTable('Arrondissements');
  }
};