const express = require('express');
const user = require('./features/user/user-routes');
const auth = require('./features/auth/auth-routes');
const me = require('./features/me/me-routes');
const category = require('./features/category/category-routes');
const item = require('./features/item/item-routes');
const chat = require('./features/chat/chat-routes');
const notification = require('./features/notification/notification-routes');

module.exports = () => {
  const app = express.Router();

  user(app);
  auth(app);
  me(app);
  category(app);
  item(app);
  chat(app);
  notification(app);

  return app;
};
