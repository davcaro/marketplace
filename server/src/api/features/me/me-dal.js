const { Op } = require('sequelize');
const {
  User,
  Item,
  ItemFavorite,
  Location,
  Review
} = require('../../../db/models');

const findById = id => User.scope('public').findOne({ where: { id } });

const updateById = (id, payload) =>
  User.scope('public').update(payload, {
    where: { id },
    individualHooks: true
  });

const updateLocation = async (id, payload) =>
  User.findOne({
    where: { id },
    include: [{ model: Location, as: 'location' }]
  }).then(async user => {
    if (user.location) {
      return user.location.update(payload);
    }
    const location = await Location.create(payload);

    return user.update({ locationId: location.id }, { where: { id } });
  });

const deleteById = id => User.scope('public').destroy({ where: { id } });

const findFavorites = async (userId, query) => {
  const items = await Item.scope('full').findAndCountAll({
    distinct: true,
    col: 'id',
    ...query,
    include: [
      {
        model: ItemFavorite,
        as: 'favorites',
        where: { userId }
      }
    ]
  });

  items.rows = items.rows.map(({ dataValues: item }) => ({
    ...item,
    favorites: item.favorites.length
  }));

  return items;
};

const findReviews = async (userId, pending) => {
  let where;

  if (pending) {
    where = {
      fromUserId: userId,
      score: null,
      description: null
    };
  } else {
    where = {
      fromUserId: userId,
      [Op.not]: {
        score: null,
        description: null
      }
    };
  }

  return Review.findAll({
    where,
    include: [
      { model: User.scope('public'), as: 'toUser' },
      {
        model: Item,
        as: 'item',
        include: [{ model: User.scope('public'), as: 'user' }]
      }
    ]
  });
};

const updateReview = async (id, userId, payload) =>
  Review.update(payload, { where: { id, fromUserId: userId } });

const deleteReview = (id, userId) =>
  Review.destroy({ where: { id, fromUserId: userId } });

module.exports = {
  findById,
  updateById,
  updateLocation,
  deleteById,
  findFavorites,
  findReviews,
  updateReview,
  deleteReview
};
