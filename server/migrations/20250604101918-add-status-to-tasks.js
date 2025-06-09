'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Tasks',
      'status',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'to_do',
        validate: {
          isIn: [['to_do', 'in_progress', 'done', 'archived']]
        }
      },
      {
        after: 'priority'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'status');
  }
};
