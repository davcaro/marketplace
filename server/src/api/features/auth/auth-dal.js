const { User } = require('../../../db/models');

const create = payload => User.create(payload);

module.exports = {
  create
};
