const { Op } = require('sequelize');
const { Item } = require('../../../db/models');
const { ItemImage } = require('../../../db/models');
const { ItemFavorite } = require('../../../db/models');

const countFavorites = ({ dataValues: item }) => ({
  ...item,
  favorites: item.favorites.length
});

const count = id => Item.count({ where: { id } });

const findAndPaginate = async query => {
  const items = await Item.scope('full').findAndCountAll({
    distinct: true,
    col: 'Item.id',
    ...query
  });

  items.rows = items.rows.map(countFavorites);

  return items;
};

const findById = async id => {
  const item = await Item.scope('full').findOne({ where: { id } });

  return countFavorites(item);
};

const findFavorites = id => ItemFavorite.findAll({ where: { itemId: id } });

const create = payload => Item.create(payload);

const addImages = images => ItemImage.bulkCreate(images);

const addImage = (itemId, image) => ItemImage.create({ itemId, image });

const addFavorite = (userId, itemId) =>
  ItemFavorite.findOrCreate({ where: { userId, itemId } });

const findOrCreateImage = (itemId, image) =>
  ItemImage.findCreateFind({ where: { itemId, image } });

const updateById = (id, payload) =>
  Item.scope('full').update(payload, { where: { id } });

const deleteById = id => Item.scope('full').destroy({ where: { id } });

const removeImage = (id, itemId) =>
  ItemImage.destroy({ where: { id, itemId } });

const removeImagesNotIn = (itemId, images) =>
  ItemImage.destroy({ where: { image: { [Op.notIn]: images }, itemId } });

const removeFavorite = (userId, itemId) =>
  ItemFavorite.destroy({ where: { userId, itemId } });

module.exports = {
  count,
  findAndPaginate,
  findById,
  findFavorites,
  create,
  addImages,
  addImage,
  addFavorite,
  findOrCreateImage,
  updateById,
  deleteById,
  removeImage,
  removeImagesNotIn,
  removeFavorite
};
