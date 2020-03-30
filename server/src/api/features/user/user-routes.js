const express = require('express');
const userController = require('./user-controller');
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
};
