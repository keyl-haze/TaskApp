'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.User, {
        foreignKey: 'owner',
        as: 'Owner'
      });
      Project.belongsToMany(models.User, {
        foreignKey: 'projectId',
        through: models.ProjectUser.tableName
      });
      Project.hasMany(models.ProjectUser, {
        foreignKey: 'projectId',
        as: 'ProjectUsers'
      });
    }
  }
  Project.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      owner: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      start: {
        type: DataTypes.DATE,
        allowNull: true
      },
      end: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('to_do', 'in_progress', 'done', 'archived'),
        allowNull: false,
        defaultValue: 'to_do'
      },
      originalStatus: {
        type: DataTypes.ENUM('to_do', 'in_progress', 'done', 'archived'),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Project',
      paranoid: true
    }
  );
  return Project;
};
