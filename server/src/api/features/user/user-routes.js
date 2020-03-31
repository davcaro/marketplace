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
  app.use('/users', isAuthorized, route);

  route.get(
    '/',
    hasPermission(ACTIONS.READ, SUBJECTS.USER),
    userController.getUsers
  );
  route.get(
    '/:id',
    hasPermission(ACTIONS.READ, SUBJECTS.USER),
    userController.getUser
  );
  route.post(
    '/',
    hasPermission(ACTIONS.CREATE, SUBJECTS.USER),
    celebrate(userValidation.create),
    userController.createUser
  );
  route.patch(
    '/:id',
    hasPermission(ACTIONS.UPDATE, SUBJECTS.USER),
    celebrate(userValidation.update),
    userController.updateUser
  );
  route.delete(
    '/:id',
    hasPermission(ACTIONS.DELETE, SUBJECTS.USER),
    userController.deleteUser
  );
};
