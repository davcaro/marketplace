const express = require('express');
const user = require('./features/user/user-routes');
const auth = require('./features/auth/auth-routes');

module.exports = () => {
  const app = express.Router();

  user(app);
  auth(app);

  return app;
};
