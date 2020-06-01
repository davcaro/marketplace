/* eslint-disable no-param-reassign */

const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const {
  User,
  Category,
  Item,
  ItemView,
  ItemFavorite,
  Location,
  Review,
  Chat
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

const deleteById = id =>
  User.scope('public').destroy({ where: { id }, individualHooks: true });

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

const findReview = async id => Review.findByPk(id);

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

const findItemsMonthStats = async userId => {
  const query = {
    where: {
      createdAt: {
        [Op.between]: [
          Sequelize.fn(
            'DATE_SUB',
            Sequelize.fn('CURDATE'),
            Sequelize.literal('INTERVAL 30 DAY')
          ),
          Sequelize.fn('NOW')
        ]
      }
    },
    include: [
      {
        model: Item,
        as: 'item',
        attributes: [],
        include: [
          { model: User, as: 'user', attributes: [], where: { id: userId } }
        ],
        required: true
      }
    ]
  };

  const views = await ItemView.count({
    group: [Sequelize.fn('DATE', Sequelize.col('ItemView.createdAt'))],
    ...query
  });

  const favorites = await ItemFavorite.count({
    group: [Sequelize.fn('DATE', Sequelize.col('ItemFavorite.createdAt'))],
    ...query
  });

  const chats = await Chat.count({
    group: [Sequelize.fn('DATE', Sequelize.col('Chat.createdAt'))],
    ...query
  });

  return { views, favorites, chats };
};

const findItemsCategoriesStats = async userId =>
  Item.findAll({
    attributes: [[Sequelize.fn('COUNT', 'id'), 'items']],
    group: ['categoryId'],
    include: [
      { model: Category, as: 'category' },
      { model: User, as: 'user', attributes: [], where: { id: userId } }
    ]
  }).then(categories => {
    const totalItems = categories
      .map(category => category.dataValues.items)
      .reduce((a, b) => +a + +b, 0);

    categories.forEach(category => {
      category.dataValues.percentage =
        (+category.dataValues.items / totalItems) * 100;
    });

    return categories;
  });

module.exports = {
  findById,
  updateById,
  updateLocation,
  deleteById,
  findFavorites,
  findReview,
  findReviews,
  updateReview,
  deleteReview,
  findItemsMonthStats,
  findItemsCategoriesStats
};
