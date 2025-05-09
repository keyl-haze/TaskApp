'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');  

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // * Association with Team model
      User.hasMany(models.Team, {
        foreignKey: 'createdBy',
        as: 'teams',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
    }
    // * Check if password is valid
    async isValidPassword(password) {
      return await comparePassword(password, this.password);
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

      // * Hooks to hash password before creating or updating user
      hooks: {
        beforeCreate: async (user) => {
          user.password = await hashPassword(user.password);
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await hashPassword(user.password);
          }
        }
      }
    }
  );
  return User;
};
