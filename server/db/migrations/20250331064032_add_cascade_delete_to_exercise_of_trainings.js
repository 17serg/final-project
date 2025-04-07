'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Сначала удаляем существующее ограничение внешнего ключа
    await queryInterface.removeConstraint(
      'ExerciseOfTrainings',
      'ExerciseOfTrainings_trainingId_fkey',
    );

    // Добавляем новое ограничение с каскадным удалением
    await queryInterface.addConstraint('ExerciseOfTrainings', {
      fields: ['trainingId'],
      type: 'foreign key',
      name: 'ExerciseOfTrainings_trainingId_fkey',
      references: {
        table: 'Trainings',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем ограничение с каскадным удалением
    await queryInterface.removeConstraint(
      'ExerciseOfTrainings',
      'ExerciseOfTrainings_trainingId_fkey',
    );

    // Возвращаем исходное ограничение
    await queryInterface.addConstraint('ExerciseOfTrainings', {
      fields: ['trainingId'],
      type: 'foreign key',
      name: 'ExerciseOfTrainings_trainingId_fkey',
      references: {
        table: 'Trainings',
        field: 'id',
      },
    });
  },
};
