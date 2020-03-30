const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const logger = require('./config/logger');
const config = require('./config');
const routes = require('./api');

const app = express();

// Load passport config
require('./api/loaders/passport');

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(config.API.prefix, routes());

module.exports = app;
