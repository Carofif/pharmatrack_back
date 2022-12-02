'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryInterface.createTable('NumeroUrgences', {
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
      description: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.STRING
      },
      services: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      telephones: {
        type: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.dropTable('NumeroUrgences');
  }
};