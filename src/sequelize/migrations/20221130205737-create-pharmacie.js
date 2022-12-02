'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pharmacies', {
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
      nomProprietaire: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      ouvertToutTemps: {
        type: Sequelize.BOOLEAN
      },
      heureOuverture: {
        type: Sequelize.DATE
      },
      heureFermeture: {
        type: Sequelize.DATE
      },
      quartierId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Quartiers',
          key: 'id',
          as: 'quartierId',
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
    await queryInterface.dropTable('Pharmacies');
  }
};