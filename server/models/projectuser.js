'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProjectUser.belongsTo(models.Project, {
        foreignKey: 'projectId'
      });
      ProjectUser.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }
  ProjectUser.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'ProjectUser'
    }
  );
  return ProjectUser;
};
