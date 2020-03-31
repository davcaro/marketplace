const { User } = require('../../../db/models');

const findById = id => User.scope('public').findOne({ where: { id } });
const updateById = (id, payload) =>
  User.scope('public').update(payload, {
    where: { id },
    individualHooks: true
  });
const deleteById = id => User.scope('public').destroy({ where: { id } });

module.exports = {
  findById,
  updateById,
  deleteById
};
