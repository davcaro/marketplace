const express = require('express');
const { celebrate } = require('celebrate');
const categoryController = require('./category-controller');
const categoryValidation = require('./category-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/category', route);

  route.get('/', categoryController.getCategories);
  route.post(
    '/',
    isAuthorized,
    hasPermission(ACTIONS.CREATE, SUBJECTS.CATEGORY),
    celebrate(categoryValidation.create),
    categoryController.createCategory
  );
  route.patch(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.CATEGORY),
    celebrate(categoryValidation.update),
    categoryController.updateCategory
  );
  route.delete(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.DELETE, SUBJECTS.CATEGORY),
    categoryController.deleteCategory
  );
};
