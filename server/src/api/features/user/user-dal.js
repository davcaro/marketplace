const { User } = require('../../../db/models');
const { Location } = require('../../../db/models');

const findAll = () => User.scope('public').findAll();

const findById = id => User.scope('public').findOne({ where: { id } });

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
  create,
  createLocation,
  countById,
  countByEmail,
  updateById,
  updateLocation,
  deleteById
};
