'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'originalStatus', {
      type: Sequelize.ENUM('to_do', 'in_progress', 'done', 'archived'),
      allowNull: true,
      after: 'status' 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'originalStatus');
  }
};
