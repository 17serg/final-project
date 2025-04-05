'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ExerciseOfTrainings', 'order', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Установить начальные значения order на основе текущего порядка
    const exerciseOfTrainings = await queryInterface.sequelize.query(
      'SELECT id FROM "ExerciseOfTrainings" ORDER BY "createdAt" ASC',
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    for (let i = 0; i < exerciseOfTrainings.length; i++) {
      await queryInterface.sequelize.query(
        `UPDATE "ExerciseOfTrainings" SET "order" = ${i} WHERE id = ${exerciseOfTrainings[i].id}`,
      );
    }

    // Сделать поле обязательным после установки значений
    await queryInterface.changeColumn('ExerciseOfTrainings', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ExerciseOfTrainings', 'order');
  },
};
