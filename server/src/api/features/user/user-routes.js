const express = require('express');
const userController = require('./user-controller');

const route = express.Router();

module.exports = app => {
  app.use('/users', route);

  route.get('/', userController.getUsers);
};
