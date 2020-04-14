const { Article } = require('../../../db/models');
const { ArticleImage } = require('../../../db/models');

const findAll = query => Article.scope('full').findAll(query);
const findById = id => Article.scope('full').findOne({ where: { id } });
const create = payload => Article.create(payload);
const addImages = images => ArticleImage.bulkCreate(images);
const addImage = (articleId, image) =>
  ArticleImage.create({ articleId, image });
const updateById = (id, payload) =>
  Article.scope('full').update(payload, { where: { id } });
const deleteById = id => Article.scope('full').destroy({ where: { id } });
const removeImage = (id, articleId) =>
  ArticleImage.destroy({ where: { id, articleId } });

module.exports = {
  findAll,
  findById,
  create,
  addImages,
  addImage,
  updateById,
  deleteById,
  removeImage
};