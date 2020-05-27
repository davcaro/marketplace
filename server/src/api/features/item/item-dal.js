const { Op } = require('sequelize');
const {
  User,
  Item,
  ItemImage,
  ItemFavorite,
  ItemView,
  Location,
  Review
} = require('../../../db/models');

const countLengths = ({ dataValues: item }) => ({
  ...item,
  favorites: item.favorites.length,
  views: item.views.length
});

const count = id => Item.count({ where: { id } });

const findAndPaginate = async query => {
  const items = await Item.scope('full').findAndCountAll(query);

  items.rows = items.rows.map(countLengths);

  return items;
};

const findById = async id => {
  const item = await Item.scope('full').findOne({ where: { id } });

  return countLengths(item);
};

const findItemOwner = async id =>
  User.scope('public').findOne({
    include: [{ model: Item, as: 'items', attributes: [], where: { id } }]
  });

const findFavorites = id => ItemFavorite.findAll({ where: { itemId: id } });

const create = payload => Item.create(payload);

const createLocation = payload => Location.create(payload);

const addImages = images => ItemImage.bulkCreate(images);

const addImage = (itemId, image) => ItemImage.create({ itemId, image });

const addFavorite = (userId, itemId) =>
  ItemFavorite.findOrCreate({ where: { userId, itemId } });

const addView = (userId, itemId) => ItemView.create({ userId, itemId });

const addReviews = (itemId, userId, review) =>
  Review.bulkCreate([
    { itemId, fromUserId: review.user, toUserId: userId },
    {
      itemId,
      fromUserId: userId,
      toUserId: review.user,
      ...review
    }
  ]);

const findOrCreateImage = (itemId, image) =>
  ItemImage.findCreateFind({ where: { itemId, image } });

const updateById = (id, payload) =>
  Item.scope('full').update(payload, { where: { id } });

const updateLocation = (itemId, payload) =>
  Item.findOne({
    where: { id: itemId },
    include: [{ model: Location, as: 'location' }]
  }).then(item => item.location.update(payload));

const deleteById = id => Item.scope('full').destroy({ where: { id } });

const removeImage = (id, itemId) =>
  ItemImage.destroy({ where: { id, itemId } });

const removeImagesNotIn = (itemId, images) =>
  ItemImage.destroy({ where: { image: { [Op.notIn]: images }, itemId } });

const removeFavorite = (userId, itemId) =>
  ItemFavorite.destroy({ where: { userId, itemId } });

module.exports = {
  countLengths,
  count,
  findAndPaginate,
  findById,
  findItemOwner,
  findFavorites,
  create,
  createLocation,
  addImages,
  addImage,
  addFavorite,
  addView,
  addReviews,
  findOrCreateImage,
  updateById,
  updateLocation,
  deleteById,
  removeImage,
  removeImagesNotIn,
  removeFavorite
};
