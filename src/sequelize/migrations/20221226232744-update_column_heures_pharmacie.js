'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Pharmacies', 'heureOuverture', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.changeColumn('Pharmacies', 'heureFermeture', {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Pharmacies', 'heureOuverture', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('Pharmacies', 'heureFermeture', {
      type: Sequelize.DATE,
    });
  }
};
