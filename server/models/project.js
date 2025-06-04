'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsTo(models.User, {
        foreignKey: 'owner',
        as: 'owner'
      });
    }
  }
  Project.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      owner: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Project'
    }
  );
  return Project;
};
