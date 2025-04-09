'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserAdvices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      adviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Advices',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Добавляем уникальный индекс для предотвращения дублирования
    await queryInterface.addIndex('UserAdvices', ['userId', 'adviceId'], {
      unique: true,
      name: 'user_advice_unique',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserAdvices');
  },
};
