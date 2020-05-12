const express = require('express');
const { celebrate } = require('celebrate');
const chatController = require('./chat-controller');
const chatValidation = require('./chat-validation');
const {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
} = require('../../middleware/authenticate');

const route = express.Router();

module.exports = app => {
  app.use('/chats', isAuthorized, route);

  route.get(
    '/',
    hasPermission(ACTIONS.READ, SUBJECTS.CHAT),
    chatController.getChats
  );
  route.get(
    '/find',
    hasPermission(ACTIONS.READ, SUBJECTS.CHAT),
    hasPermission(ACTIONS.CREATE, SUBJECTS.CHAT),
    celebrate(chatValidation.findChat),
    chatController.findChat
  );
  route.get(
    '/item/:id',
    hasPermission(ACTIONS.READ, SUBJECTS.USER),
    hasPermission(ACTIONS.READ, SUBJECTS.CHAT),
    chatController.hasPermissionOnItem,
    chatController.findUsers
  );
  route.get(
    '/:id',
    hasPermission(ACTIONS.READ, SUBJECTS.MESSAGE),
    chatController.hasPermission,
    celebrate(chatValidation.getMessages),
    chatController.getMessages
  );
  route.post(
    '/:id',
    hasPermission(ACTIONS.CREATE, SUBJECTS.MESSAGE),
    chatController.hasPermission,
    celebrate(chatValidation.createMessage),
    chatController.createMessage
  );
  route.patch(
    '/:id',
    hasPermission(ACTIONS.UPDATE, SUBJECTS.CHAT),
    chatController.hasPermission,
    celebrate(chatValidation.updateChat),
    chatController.updateChat
  );
  route.delete(
    '/:id',
    hasPermission(ACTIONS.DELETE, SUBJECTS.CHAT),
    chatController.hasPermission,
    chatController.deleteChat
  );
};
