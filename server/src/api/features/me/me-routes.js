const express = require('express');
const { celebrate } = require('celebrate');
const meController = require('./me-controller');
const meValidation = require('./me-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/me', isAuthorized, route);

  route.get(
    '/',
    hasPermission(ACTIONS.READ, SUBJECTS.SELF_USER),
    meController.getUser
  );
  route.patch(
    '/',
    hasPermission(ACTIONS.UPDATE, SUBJECTS.SELF_USER),
    celebrate(meValidation.update),
    meController.updateUser
  );
  route.delete(
    '/',
    hasPermission(ACTIONS.DELETE, SUBJECTS.SELF_USER),
    meController.deleteUser
  );
};
