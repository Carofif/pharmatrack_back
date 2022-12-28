'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('PeriodeGardes', 'dateDebut', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('PeriodeGardes', 'dateFin', {
      type: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('PeriodeGardes', 'dateDebut', {
      type: Sequelize.DATE,
      allowNull: false
    });
    await queryInterface.changeColumn('PeriodeGardes', 'dateFin', {
      type: Sequelize.DATE,
      allowNull: false
    });
  }
};
