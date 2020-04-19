const itemService = require('./item-service');
const AppError = require('../../utils/app-error');

const getItems = async (req, res, next) => {
  try {
    const items = await itemService.readItems(req.query);

    return res.json(items);
  } catch (e) {
    return next(e);
  }
};

const getItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    const item = await itemService.readItem(id);

    return res.json(item);
  } catch (e) {
    return next(e);
  }
};

const uploadImage = async (req, res) => {
  return res.json({
    image: req.file.filename
  });
};

const createItem = async (req, res, next) => {
  req.body.userId = req.user.id;

  try {
    const item = await itemService.createItem(req.body);

    return res.json(item);
  } catch (e) {
    return next(e);
  }
};

const updateItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await itemService.updateItem(id, req.body);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const addImage = async (req, res, next) => {
  const { id } = req.params;

  try {
    await itemService.addImage(id, req.file.filename);

    return res.json({ image: req.file.filename });
  } catch (e) {
    return next(e);
  }
};

const deleteItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await itemService.deleteItem(id);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const removeImage = async (req, res, next) => {
  const { imageId } = req.params;
  const itemId = req.params.id;

  try {
    await itemService.removeImage(imageId, itemId);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const hasPermission = async (req, res, next) => {
  const { id } = req.params;

  if (!req.user.isAdmin()) {
    try {
      const item = await itemService.readItem(id);

      if (item.userId !== req.user.id) {
        throw new AppError(403, 'Forbidden');
      }
    } catch (e) {
      return next(e);
    }
  }

  return next();
};

module.exports = {
  getItems,
  getItem,
  uploadImage,
  createItem,
  updateItem,
  addImage,
  deleteItem,
  removeImage,
  hasPermission
};
