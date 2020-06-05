/* eslint-disable no-unused-vars */

'use strict';

const seeds = require('../../../seeds');
const images = require('./item-images.json');

module.exports = {
  up: (queryInterface, Sequelize) => {
    seeds.copyItemImages();

    return queryInterface.bulkInsert('ItemImages', images);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ItemImages', null, {});
  }
};
