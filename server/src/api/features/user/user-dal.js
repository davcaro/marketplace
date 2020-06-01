const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { User, Item, Location, Review } = require('../../../db/models');

const findAll = () => User.scope('public').findAll();

const findById = id => User.scope('public').findOne({ where: { id } });

const findUserReviews = id =>
  Review.findAll({
    where: {
      toUserId: id,
      [Op.not]: {
        score: null,
        description: null
      }
    },
    include: { model: User.scope('public'), as: 'fromUser' }
  });

const findUserScore = async id => {
  const reviews = await Review.count({
    where: {
      toUserId: id,
      [Op.not]: {
        score: null,
        description: null
      }
    }
  });

  const score = await Review.findOne({
    attributes: [
      [
        Sequelize.fn('IFNULL', Sequelize.fn('AVG', Sequelize.col('score')), 0),
        'score'
      ]
    ],
    where: {
      toUserId: id,
      score: { [Op.not]: null }
    }
  });

  return { score: score.score, reviews };
};

const create = payload => User.create(payload);

const createLocation = payload => Location.create(payload);

const countById = id => User.count({ where: { id } });

const countByEmail = email => User.count({ where: { email } });

const countUserItems = userId => Item.count({ where: { userId } });

const updateById = (id, payload) =>
  User.scope('public').update(payload, {
    where: { id },
    individualHooks: true
  });

const updateLocation = (userId, payload) =>
  User.findOne({
    where: { id: userId },
    include: [{ model: Location, as: 'location' }]
  }).then(async user => {
    if (user.location) {
      return user.location.update(payload);
    }
    const location = await Location.create(payload);

    return user.update({ locationId: location.id }, { where: { id: userId } });
  });

const deleteById = id =>
  User.scope('public').destroy({ where: { id }, individualHooks: true });

module.exports = {
  findAll,
  findById,
  findUserReviews,
  findUserScore,
  create,
  createLocation,
  countById,
  countByEmail,
  countUserItems,
  updateById,
  updateLocation,
  deleteById
};
