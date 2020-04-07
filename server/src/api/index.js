const express = require('express');
const user = require('./features/user/user-routes');
const auth = require('./features/auth/auth-routes');
const me = require('./features/me/me-routes');
const category = require('./features/category/category-routes');
const article = require('./features/article/article-routes');

module.exports = () => {
  const app = express.Router();

  user(app);
  auth(app);
  me(app);
  category(app);
  article(app);

  return app;
};
