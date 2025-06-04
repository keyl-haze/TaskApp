'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // * Drop constraints
    await queryInterface.removeConstraint('Tasks', 'Tasks_reporter_fkey');
    await queryInterface.removeConstraint('Tasks', 'Tasks_assignee_fkey');

    // * Change column types
    await queryInterface.changeColumn('Tasks', 'reporter', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('Tasks', 'assignee', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // * Add back constraints
    await queryInterface.addConstraint('Tasks', {
      fields: ['reporter'],
      type: 'foreign key',
      name: 'Tasks_reporter_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

    // * Drop constraints
    await queryInterface.removeConstraint('Tasks', 'Tasks_reporter_fkey');
    await queryInterface.removeConstraint('Tasks', 'Tasks_assignee_fkey');

    // * Revert column types back to BIGINT
    await queryInterface.changeColumn('Tasks', 'reporter', {
      type: Sequelize.BIGINT,
      allowNull: false
    });

    await queryInterface.changeColumn('Tasks', 'assignee', {
      type: Sequelize.BIGINT,
      allowNull: true
    });

    // * Re-add constraints
    await queryInterface.addConstraint('Tasks', {
      fields: ['reporter'],
      type: 'foreign key',
      name: 'Tasks_reporter_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Tasks', {
      fields: ['assignee'],
      type: 'foreign key',
      name: 'Tasks_assignee_fkey',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  }
};
