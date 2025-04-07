'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      trainingExperience: {
        type: Sequelize.INTEGER,
      },
      personalRecords: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      trainingCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserProfiles');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_UserProfiles_gender";',
    );
  },
};
