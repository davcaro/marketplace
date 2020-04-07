const express = require('express');
const { celebrate } = require('celebrate');
const articleController = require('./article-controller');
const articleValidation = require('./article-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/articles', route);

  route.get('/', articleController.getArticles);
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
    articleController.updateArticle
  );
  route.delete(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.DELETE, SUBJECTS.ARTICLE),
    articleController.deleteArticle
  );
};
