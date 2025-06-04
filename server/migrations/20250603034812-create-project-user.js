'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'ProjectUsers',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          allowNull: false,
          references: {
            key: 'id',
            model: 'Users'
          },
          type: Sequelize.INTEGER
        },
        projectId: {
          allowNull: false,
          references: {
            key: 'id',
            model: 'Projects'
          },
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        uniqueKeys: {
          uniqueProjectUser: {
            customIndex: true,
            fields: ['userId', 'projectId']
          }
        }
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProjectUsers');
  }
};
