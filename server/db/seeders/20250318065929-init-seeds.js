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
          email: 'q@q',
          password: await bcrypt.hash('111111', 10),
        },
        {
          name: 'w',
          email: 'w@w',
          password: await bcrypt.hash('111111', 10),
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'Books',
      [
        {
          title: 'Book1',
          description: 'Book1Book1',
          link: 'https://avatars.mds.yandex.net/i?id=37c03c866b6673cac081fe21add461993aadd88f-5218274-images-thumbs&n=13',
          userId: 1,
          fileName: 'Book1.txt',
        },
        {
          title: 'Book2',
          description: 'Book2Book2',
          link: 'https://avatars.mds.yandex.net/i?id=cc1dd7c2c6a8657bb1048ee3435e053697d6bdc9-11444350-images-thumbs&n=13',
          userId: 2,
          fileName: 'Book2.txt',
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'Likes',
      [
        {
          userId: 1,
          bookId: 1,
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'Comments',
      [
        {
          text: 'Cool',
          authorId: 1,
          bookId: 1,
        },
        {
          text: 'Not cool',
          authorId: 2,
          bookId: 2,
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'Reads',
      [
        {
          userId: 1,
          bookId: 2,
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
