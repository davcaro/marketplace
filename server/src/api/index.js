const express = require('express');
const user = require('./features/user/user-routes');
const auth = require('./features/auth/auth-routes');
const me = require('./features/me/me-routes');

module.exports = () => {
  const app = express.Router();

  user(app);
  auth(app);
  me(app);

  return app;
};
