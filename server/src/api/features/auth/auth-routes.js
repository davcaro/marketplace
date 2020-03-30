const express = require('express');
const { celebrate } = require('celebrate');
const authController = require('./auth-controller');
const authValidation = require('./auth-validation');
const {
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/auth', route);

  route.post('/login', celebrate(authValidation.login), authController.login);
  route.post(
    '/signup',
    hasPermission(ACTIONS.CREATE, SUBJECTS.USER),
    celebrate(authValidation.signUp),
    authController.signUp
  );
};
