const express = require('express');
const { celebrate } = require('celebrate');
const userController = require('./user-controller');
const userValidation = require('./user-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/users', route);

  route.get(
    '/',
    isAuthorized,
    hasPermission(ACTIONS.MANAGE, SUBJECTS.USER),
    userController.getUsers
  );
  route.post(
    '/',
    isAuthorized,
    hasPermission(ACTIONS.CREATE, SUBJECTS.USER),
    celebrate(userValidation.create),
    userController.createUser
  );
  route.get(
    '/:id',
    hasPermission(ACTIONS.READ, SUBJECTS.USER),
    userController.getUser
  );
  route.patch(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.UPDATE, SUBJECTS.USER),
    celebrate(userValidation.update),
    userController.updateUser
  );
  route.delete(
    '/:id',
    isAuthorized,
    hasPermission(ACTIONS.DELETE, SUBJECTS.USER),
    userController.deleteUser
  );
  route.get(
    '/:id/items',
    hasPermission(ACTIONS.READ, SUBJECTS.USER),
    userController.getUserItems
  );
  route.get(
    '/:id/reviews',
    hasPermission(ACTIONS.READ, SUBJECTS.REVIEW),
    userController.getUserReviews
  );
};
