const express = require('express');
const { celebrate } = require('celebrate');
const config = require('../../../config');
const uploader = require('../../loaders/uploader');
const itemController = require('./item-controller');
const itemValidation = require('./item-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();
const upload = uploader.getUploader(config.API.items_path);

module.exports = app => {
  app.use('/items', route);

  route.get('/', itemController.getItems);
  route.post(
    '/images',
    isAuthorized,
    hasPermission(ACTIONS.CREATE, SUBJECTS.ITEM),
    upload.single('image'),
    itemController.uploadImage
  );
  route.get('/:id', itemController.getItem);
  route.post(
    '/',
    isAuthorized,
    hasPermission(ACTIONS.CREATE, SUBJECTS.ITEM),
    celebrate(itemValidation.create),
    itemController.createItem
  );
  route.patch(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.ITEM),
    celebrate(itemValidation.update),
    itemController.hasPermission,
    itemController.updateItem
  );
  route.delete(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.DELETE, SUBJECTS.ITEM),
    itemController.hasPermission,
    itemController.deleteItem
  );
  route.post(
    '/:id/images',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.ITEM),
    itemController.hasPermission,
    upload.single('image'),
    itemController.addImage
  );
  route.delete(
    '/:id/images/:imageId',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.ITEM),
    itemController.hasPermission,
    itemController.removeImage
  );
};
