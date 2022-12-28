'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Pharmacies', 'ville', {
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn(
      'Pharmacies',
      'ville'
    );
  }
};
