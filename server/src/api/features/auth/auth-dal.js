const { User } = require('../../../db/models');
const { Location } = require('../../../db/models');

const create = payload => User.create(payload);
const count = email => User.count({ where: { email } });
const findLocationById = id => Location.findOne({ where: { id } });

module.exports = {
  create,
  count,
  findLocationById
};
