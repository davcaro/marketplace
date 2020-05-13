const { Op } = require('sequelize');
const { User, Location, Review } = require('../../../db/models');

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

const create = payload => User.create(payload);

const createLocation = payload => Location.create(payload);

const countById = id => User.count({ where: { id } });

const countByEmail = email => User.count({ where: { email } });

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

const deleteById = id => User.scope('public').destroy({ where: { id } });

module.exports = {
  findAll,
  findById,
  findUserReviews,
  create,
  createLocation,
  countById,
  countByEmail,
  updateById,
  updateLocation,
  deleteById
};
