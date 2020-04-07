const { Article } = require('../../../db/models');

const findAll = () => Article.scope('full').findAll();
const findById = id => Article.scope('full').findOne({ where: { id } });
const create = payload => Article.create(payload);
const updateById = (id, payload) =>
  Article.scope('full').update(payload, { where: { id } });
const deleteById = id => Article.scope('full').destroy({ where: { id } });

module.exports = {
  findAll,
  findById,
  create,
  updateById,
  deleteById
};
