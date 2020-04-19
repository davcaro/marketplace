const { Item } = require('../../../db/models');
const { ItemImage } = require('../../../db/models');

const findAndPaginate = query =>
  Item.scope('full').findAndCountAll({
    distinct: true,
    col: 'Item.id',
    ...query
  });
const findById = id => Item.scope('full').findOne({ where: { id } });
const create = payload => Item.create(payload);
const addImages = images => ItemImage.bulkCreate(images);
const addImage = (itemId, image) => ItemImage.create({ itemId, image });
const updateById = (id, payload) =>
  Item.scope('full').update(payload, { where: { id } });
const deleteById = id => Item.scope('full').destroy({ where: { id } });
const removeImage = (id, itemId) =>
  ItemImage.destroy({ where: { id, itemId } });

module.exports = {
  findAndPaginate,
  findById,
  create,
  addImages,
  addImage,
  updateById,
  deleteById,
  removeImage
};