const { User } = require('../../../db/models');

const findAll = () => User.scope('public').findAll();
const findById = id => User.scope('public').findOne({ where: { id } });
const create = payload => User.create(payload);
const count = email => {
  return User.count({
    where: {
      email
    }
  });
};
const updateById = (id, payload) =>
  User.scope('public').update(payload, {
    where: { id },
    individualHooks: true
  });
const deleteById = id => User.scope('public').destroy({ where: { id } });

module.exports = {
  findAll,
  findById,
  create,
  count,
  updateById,
  deleteById
};
