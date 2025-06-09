'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT
      },
      owner: {
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        type: Sequelize.INTEGER
      },
      start: {
        allowNull: true,
        type: Sequelize.DATE
      },
      end: {
        allowNull: true,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('to_do', 'in_progress', 'done', 'archived'),
        defaultValue: 'to_do',
        type: Sequelize.STRING
      },
      originalStatus: {
        allowNull: true,
        type: Sequelize.ENUM('to_do', 'in_progress', 'done', 'archived'),
        defaultValue: null,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};
