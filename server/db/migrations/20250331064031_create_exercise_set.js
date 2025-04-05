'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ExerciseSets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      exerciseOfTrainingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ExerciseOfTrainings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      setNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Номер подхода',
      },
      actualWeight: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Фактический вес в кг',
      },
      actualReps: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Фактическое количество повторений',
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Статус выполнения подхода',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Заметки к подходу',
      },
      executionDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Дата выполнения подхода',
      },
      executionTime: {
        type: Sequelize.TIME,
        allowNull: true,
        comment: 'Время выполнения подхода',
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

    // Добавляем индекс для быстрого поиска по exerciseOfTrainingId
    await queryInterface.addIndex('ExerciseSets', ['exerciseOfTrainingId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ExerciseSets');
  },
};
