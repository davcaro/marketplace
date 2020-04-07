const { Category } = require('../../../db/models');

const findAll = () => Category.findAll();
const create = payload => Category.create(payload);
const updateById = (id, payload) => Category.update(payload, { where: { id } });
const deleteById = id => Category.destroy({ where: { id } });

module.exports = {
  findAll,
  create,
  updateById,
  deleteById
};
