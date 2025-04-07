'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'q',
          surname: 'w',
          birthDate: '03.07.1987',
          email: 'q@q',
          password: await bcrypt.hash('111111', 10),
          trener: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'w',
          surname: 't',
          birthDate: '03.07.1990',
          email: 'w@w',
          password: await bcrypt.hash('111111', 10),
          trener: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      'Exercises',
      [
        {
          name: 'Приседания со штангой',
          description: 'Базовое упражнение для развития мышц ног',
          category: 'Ноги',
          difficulty: 'intermediate',
          muscle_groups: ['Квадрицепсы', 'Ягодицы'],
          equipment: 'Штанга',
          image: '/exercises/squat.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Жим штанги лежа',
          description: 'Базовое упражнение для развития грудных мышц',
          category: 'Грудь',
          difficulty: 'intermediate',
          muscle_groups: ['Грудные мышцы', 'Трицепсы'],
          equipment: 'Штанга',
          image: '/exercises/bench-press.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Подтягивания',
          description: 'Базовое упражнение для развития мышц спины',
          category: 'Спина',
          difficulty: 'advanced',
          muscle_groups: ['Широчайшие мышцы спины', 'Бицепсы'],
          equipment: 'Турник',
          image: '/exercises/pull-ups.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Становая тяга',
          description: 'Базовое упражнение для развития мышц спины и ног',
          category: 'Спина',
          difficulty: 'advanced',
          muscle_groups: ['Поясница', 'Бицепс бедра'],
          equipment: 'Штанга',
          image: '/exercises/deadlift.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Exercises', null, {});
  },
};
