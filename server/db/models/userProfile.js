'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  UserProfile.init(
    {
      avatar: DataTypes.STRING,
      gender: DataTypes.STRING,
      trainingExperience: DataTypes.INTEGER,
      personalRecords: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      trainingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'UserProfile',
    },
  );
  return UserProfile;
};
