const express = require('express');
const { celebrate } = require('celebrate');
const config = require('../../../config');
const uploader = require('../../loaders/uploader');
const articleController = require('./article-controller');
const articleValidation = require('./article-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();
const upload = uploader.getUploader(config.API.articles_path);

module.exports = app => {
  app.use('/articles', route);

  route.get('/', articleController.getArticles);
  route.post(
    '/images',
    isAuthorized,
    hasPermission(ACTIONS.CREATE, SUBJECTS.ARTICLE),
    upload.single('image'),
    articleController.uploadImage
  );
  route.get('/:id', articleController.getArticle);
  route.post(
    '/',
    isAuthorized,
    hasPermission(ACTIONS.CREATE, SUBJECTS.ARTICLE),
    celebrate(articleValidation.create),
    articleController.createArticle
  );
  route.patch(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.ARTICLE),
    celebrate(articleValidation.update),
    articleController.hasPermission,
    articleController.updateArticle
  );
  route.delete(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.DELETE, SUBJECTS.ARTICLE),
    articleController.hasPermission,
    articleController.deleteArticle
  );
  route.post(
    '/:id/images',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.ARTICLE),
    articleController.hasPermission,
    upload.single('image'),
    articleController.addImage
  );
  route.delete(
    '/:id/images/:imageId',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.ARTICLE),
    articleController.hasPermission,
    articleController.removeImage
  );
};
