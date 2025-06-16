'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: 'reporter',
        as: 'Reporter'
      });
      Task.belongsTo(models.User, {
        foreignKey: 'assignee',
        as: 'Assignee'
      });
      Task.belongsTo(models.Project, {
        foreignKey: 'project',
        as: 'Project'
      });
    }
  }
  Task.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('bug', 'feature', 'task'),
        allowNull: false,
        defaultValue: 'task'
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium'
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'to_do',
        validate: {
          isIn: [['to_do', 'in_progress', 'done', 'archived']]
        }
      },
      originalStatus: {
        type: DataTypes.ENUM('to_do', 'in_progress', 'done', 'archived'),
        allowNull: true
      },
      reporter: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      assignee: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      project: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Task',
      paranoid: true
    }
  );
  return Task;
};
