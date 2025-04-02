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
