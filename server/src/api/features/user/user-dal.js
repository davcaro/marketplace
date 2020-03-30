const { User } = require('../../../db/models');

const findAll = () => User.scope('public').findAll();

module.exports = {
  findAll
};