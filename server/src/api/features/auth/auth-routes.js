const express = require('express');
const { celebrate } = require('celebrate');
const authController = require('./auth-controller');
const authValidation = require('./auth-validation');

const route = express.Router();

module.exports = app => {
  app.use('/auth', route);

  route.post('/login', celebrate(authValidation.login), authController.login);
  route.post(
    '/signup',
    celebrate(authValidation.signUp),
    authController.signUp
  );
};
