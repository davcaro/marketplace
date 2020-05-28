const express = require('express');
const { celebrate } = require('celebrate');
const notificationController = require('./notification-controller');
const notificationValidation = require('./notification-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/notifications', isAuthorized, route);

  route.get(
    '/',
    hasPermission(ACTIONS.READ, SUBJECTS.NOTIFICATION),
    notificationController.getNotifications
  );
  route.get(
    '/count',
    hasPermission(ACTIONS.READ, SUBJECTS.NOTIFICATION),
    notificationController.countUnreadNotifications
  );
  route.patch(
    '/',
    hasPermission(ACTIONS.UPDATE, SUBJECTS.NOTIFICATION),
    celebrate(notificationValidation.notificationTypesBody),
    notificationController.markAsReadAll
  );
  route.patch(
    '/:id',
    hasPermission(ACTIONS.UPDATE, SUBJECTS.NOTIFICATION),
    notificationController.hasPermission,
    notificationController.markAsRead
  );
  route.delete(
    '/',
    hasPermission(ACTIONS.DELETE, SUBJECTS.NOTIFICATION),
    celebrate(notificationValidation.notificationTypesQuery),
    notificationController.deleteAll
  );
  route.delete(
    '/:id',
    hasPermission(ACTIONS.DELETE, SUBJECTS.NOTIFICATION),
    notificationController.hasPermission,
    notificationController.deleteNotification
  );
};
