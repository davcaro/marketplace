const { User } = require('../../../db/models');
const { Item } = require('../../../db/models');
const { ItemFavorite } = require('../../../db/models');

const findById = id => User.scope('public').findOne({ where: { id } });

const updateById = (id, payload) =>
  User.scope('public').update(payload, {
    where: { id },
    individualHooks: true
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

module.exports = {
  findById,
  updateById,
  deleteById,
  findFavorites
};
