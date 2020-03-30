const express = require('express');
const user = require('./features/user/user-routes');

module.exports = () => {
  const app = express.Router();

  user(app);

  return app;
};
