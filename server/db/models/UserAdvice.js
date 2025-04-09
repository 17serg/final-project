const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserAdvice extends Model {
    static associate(models) {
      UserAdvice.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      UserAdvice.belongsTo(models.Advice, {
        foreignKey: 'adviceId',
        as: 'advice',
      });
    }
  }

  UserAdvice.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      adviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Advices',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'UserAdvice',
      tableName: 'UserAdvices',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'adviceId'],
        },
      ],
    },
  );

  return UserAdvice;
};
