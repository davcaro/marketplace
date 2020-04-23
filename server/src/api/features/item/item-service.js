/* eslint-disable no-use-before-define,default-case,no-fallthrough,no-restricted-syntax */

const { Op } = require('sequelize');
const itemDAL = require('./item-dal');
const categoryDAL = require('../category/category-dal');
const AppError = require('../../utils/app-error');
const Paginator = require('../../utils/paginator');

const readItems = async params => {
  const query = getQuery(params);
  let items;

  try {
    items = await itemDAL.findAndPaginate(query);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  return Paginator.paginate(items, +params.limit, +params.offset);
};

const readItem = async id => {
  let item;

  try {
    item = await itemDAL.findById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!item) {
    throw new AppError(404, 'Item not found');
  }

  return item;
};

const createItem = async body => {
  const { categoryId } = body;
  const categoryExists = (await categoryDAL.count(categoryId)) > 0;

  if (!categoryExists) {
    throw new AppError(400, 'Bad Request');
  }

  try {
    const item = await itemDAL.create(body);

    const images = body.images.map(image => {
      return { itemId: item.id, image };
    });
    await itemDAL.addImages(images);

    return item;
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const updateItem = async (id, body) => {
  const { categoryId } = body;

  if (categoryId) {
    const categoryExists = (await categoryDAL.count(categoryId)) > 0;

    if (!categoryExists) {
      throw new AppError(400, 'Bad Request');
    }
  }

  try {
    if (body.images) {
      await itemDAL.removeImagesNotIn(id, body.images);
      for await (const image of body.images) {
        itemDAL.findOrCreateImage(id, image);
      }
    }

    return await itemDAL.updateById(id, body);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const addImage = async (id, image) => {
  try {
    return await itemDAL.addImage(id, image);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const deleteItem = async id => {
  let deletedRows;

  try {
    deletedRows = await itemDAL.deleteById(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (deletedRows === 0) {
    throw new AppError(404, 'Item not found');
  }

  return deletedRows;
};

const removeImage = async (id, itemId) => {
  try {
    return await itemDAL.removeImage(id, itemId);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const readFavorites = async id => {
  let item;

  try {
    item = await itemDAL.count(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!item) {
    throw new AppError(404, 'Item not found');
  }

  try {
    return await itemDAL.findFavorites(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const addFavorite = async (id, user) => {
  let item;

  try {
    item = await itemDAL.count(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!item) {
    throw new AppError(404, 'Item not found');
  }

  try {
    return await itemDAL.addFavorite(user.id, id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const removeFavorite = async (id, user) => {
  try {
    return await itemDAL.removeFavorite(user.id, id);
  } catch (e) {
    throw new AppError(500, e.message);
  }
};

const addView = async (id, user) => {
  let item;

  try {
    item = await itemDAL.count(id);
  } catch (e) {
    throw new AppError(500, e.message);
  }

  if (!item) {
    throw new AppError(404, 'Item not found');
  }

  try {
    return await itemDAL.addView(user.id, id);
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

  return {
    where,
    order,
    limit: +params.limit || null,
    offset: +params.offset || null
  };
};

module.exports = {
  readItems,
  readItem,
  createItem,
  updateItem,
  addImage,
  deleteItem,
  removeImage,
  readFavorites,
  addFavorite,
  removeFavorite,
  addView
};
