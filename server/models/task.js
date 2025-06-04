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
      reporter: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      assignee: {
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
