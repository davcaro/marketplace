const { User } = require('../../../db/models');

const findAll = () => User.findAll();

module.exports = {
  findAll
};
