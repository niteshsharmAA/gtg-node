'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Logs',
    [
      {
        id: 1,
        action: 'POST',
        url: 'https://url/test',
        role: 'user',
        req_obj: '{"req":"user"}',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Logs', null, {}),
};
