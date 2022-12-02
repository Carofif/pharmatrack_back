'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PeriodeGardes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4')
      },
      dateDebut: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dateFin: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.createTable('Gardes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.fn('uuid_generate_v4')
      },
      pharmacieId: {
        type: Sequelize.UUID,
        references: { model: 'Pharmacies', key: 'id' },
        onDelete: 'CASCADE',
      },
      periodeGardeId: {
        type: Sequelize.UUID,
        references: { model: 'PeriodeGardes', key: 'id' },
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('PeriodeGardes');
    await queryInterface.dropTable('Gardes');
  }
};