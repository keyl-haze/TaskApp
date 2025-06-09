'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: 'reporter',
        as: 'reportedTasks'
      });
      User.hasMany(models.Task, {
        foreignKey: 'assignee',
        as: 'assignedTasks'
      });
      User.hasMany(models.Project, {
        foreignKey: 'owner',
        as: 'ownedProjects'
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      middleName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('super_admin', 'admin', 'manager', 'viewer'),
        allowNull: false,
        defaultValue: 'admin'
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100]
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['password'] }
      }
    }
  );
  return User;
};
