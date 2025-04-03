'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
        },
        {
          name: 'w',
          surname: 't',
          birthDate: '03.07.1990',
          email: 'w@w',
          password: await bcrypt.hash('111111', 10),
          trener: false,
        },
      ],
      {},
    );

    await queryInterface.bulkInsert('Exercises', [
      {
        name: 'Приседания',
        description: 'Базовое упражнение для ног и ягодиц.',
        category: 'Ноги',
        difficulty: 'Начинающий',
        muscle_group: 'Квадрицепсы, ягодицы',
        equipment: false,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Squat_exercise.jpg/320px-Squat_exercise.jpg',
      },
      {
        name: 'Отжимания',
        description: 'Упражнение для груди и трицепсов.',
        category: 'Грудь',
        difficulty: 'Начинающий',
        muscle_group: 'Грудные мышцы, трицепсы',
        equipment: false,
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Push_up.jpg/320px-Push_up.jpg',
      },
      {
        name: 'Подтягивания',
        description: 'Упражнение для спины и бицепсов.',
        category: 'Спина',
        difficulty: 'Продвинутый',
        muscle_group: 'Широчайшие мышцы спины, бицепсы',
        equipment: true, // Турник — это оборудование
        image_url: 'https://live.staticflickr.com/65535/51134208147_1e0d1a8e7b_c.jpg',
      },
      {
        name: 'Становая тяга',
        description: 'Упражнение для спины и ног со штангой.',
        category: 'Спина',
        difficulty: 'Продвинутый',
        muscle_group: 'Поясница, бицепс бедра',
        equipment: true, // Штанга — оборудование
        image_url: 'https://live.staticflickr.com/65535/49036800361_9c1803d5ba_b.jpg',
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
