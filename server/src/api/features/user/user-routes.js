const express = require('express');
const userController = require('./user-controller');
const authenticate = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/users', authenticate, route);

  route.get('/', userController.getUsers);
};
