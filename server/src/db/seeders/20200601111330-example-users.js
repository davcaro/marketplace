/* eslint-disable no-unused-vars */

'use strict';

const seeds = require('../../../seeds');

module.exports = {
  up: (queryInterface, Sequelize) => {
    seeds.copyUserAvatars();
    const users = seeds.getUsers(15); // Make sure there is at least 2 users, which will have all items

    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
