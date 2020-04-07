const articleDAL = require('./article-dal');
const categoryDAL = require('../category/category-dal');
const AppError = require('../../utils/app-error');

const readArticles = async () => {
  try {
    return await articleDAL.findAll();
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readArticle = async id => {
  let article;

  try {
    article = await articleDAL.findById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!article) {
    throw new AppError(404, 'Article not found');
  }

  return article;
};

const createArticle = async body => {
  const { categoryId } = body;
  const categoryExists = (await categoryDAL.count(categoryId)) > 0;

  if (!categoryExists) {
    throw new AppError(400, 'Bad Request');
  }

  try {
    return await articleDAL.create(body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const updateArticle = async (id, body) => {
  const { categoryId } = body;
  const categoryExists = (await categoryDAL.count(categoryId)) > 0;

  if (!categoryExists) {
    throw new AppError(400, 'Bad Request');
  }

  try {
    return await articleDAL.updateById(id, body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const deleteArticle = async id => {
  let deletedRows;

  try {
    deletedRows = await articleDAL.deleteById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (deletedRows === 0) {
    throw new AppError(404, 'Article not found');
  }

  return deletedRows;
};

module.exports = {
  readArticles,
  readArticle,
  createArticle,
  updateArticle,
  deleteArticle
};
