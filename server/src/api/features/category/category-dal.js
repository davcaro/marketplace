const { Category } = require('../../../db/models');

const findAll = () => Category.findAll();
const count = id => Category.count({ where: { id } });
const create = payload => Category.create(payload);
const updateById = (id, payload) => Category.update(payload, { where: { id } });
const deleteById = id => Category.destroy({ where: { id } });

module.exports = {
  findAll,
  count,
  create,
  updateById,
  deleteById
};
