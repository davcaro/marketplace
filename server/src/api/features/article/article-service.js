/* eslint-disable no-use-before-define,default-case,no-fallthrough */

const { Op } = require('sequelize');
const articleDAL = require('./article-dal');
const categoryDAL = require('../category/category-dal');
const AppError = require('../../utils/app-error');
const Paginator = require('../../utils/paginator');

const readArticles = async params => {
  if (!params.limit) {
    params.limit = 30;
  }
  if (!params.offset) {
    params.offset = 0;
  }

  const query = getQuery(params);
  let articles;

  try {
    articles = await articleDAL.findAndPaginate(query);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  return Paginator.paginate(articles, +params.limit, +params.offset);
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
    const article = await articleDAL.create(body);

    const images = body.images.map(image => {
      return { articleId: article.id, image };
    });
    await articleDAL.addImages(images);

    return article;
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const updateArticle = async (id, body) => {
  const { categoryId } = body;

  if (categoryId) {
    const categoryExists = (await categoryDAL.count(categoryId)) > 0;

    if (!categoryExists) {
      throw new AppError(400, 'Bad Request');
    }
  }

  try {
    return await articleDAL.updateById(id, body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const addImage = async (id, image) => {
  try {
    return await articleDAL.addImage(id, image);
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

const removeImage = async (id, articleId) => {
  try {
    return await articleDAL.removeImage(id, articleId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const getQuery = params => {
  const where = {};
  let order = null;

  if (params.keywords) {
    where[Op.or] = [
      {
        title: {
          [Op.like]: `%${params.keywords}`
        }
      },
      {
        title: {
          [Op.like]: `%${params.keywords}%`
        }
      },
      {
        title: {
          [Op.like]: `${params.keywords}%`
        }
      },
      {
        description: {
          [Op.like]: `%${params.keywords}`
        }
      },
      {
        description: {
          [Op.like]: `%${params.keywords}%`
        }
      },
      {
        description: {
          [Op.like]: `${params.keywords}%`
        }
      }
    ];
  }
  if (params.category && params.category !== '-1') {
    where.categoryId = params.category;
  }
  if (params.min_price || params.max_price) {
    where.price = {};
  }
  if (params.min_price) {
    where.price[Op.gte] = params.min_price;
  }
  if (params.max_price) {
    where.price[Op.lte] = params.max_price;
  }
  if (params.published) {
    const published = params.published.match(/[\d]+|\D+/g);

    let seconds = 1;
    switch (published[1]) {
      case 'y':
        seconds *= 365;
      case 'm':
        seconds *= 30 / 7;
      case 'w':
        seconds *= 7;
      case 'd':
        seconds *= 24;
      case 'h':
        seconds *= 3600;
        break;
    }

    where.createdAt = {
      [Op.gte]: new Date(Date.now() - published[0] * seconds * 1000)
    };
  }
  if (params.order) {
    switch (params.order) {
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      case 'lowest_price':
        order = [
          ['price', 'ASC'],
          ['createdAt', 'DESC']
        ];
        break;
      case 'highest_price':
        order = [
          ['price', 'DESC'],
          ['createdAt', 'DESC']
        ];
        break;
    }
  }

  return { where, order, limit: +params.limit, offset: +params.offset };
};

module.exports = {
  readArticles,
  readArticle,
  createArticle,
  updateArticle,
  addImage,
  deleteArticle,
  removeImage
};
