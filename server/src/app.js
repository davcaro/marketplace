const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const logger = require('./api/loaders/logger');
const config = require('./config');
const routes = require('./api');
const errors = require('./api/middleware/errors');

const app = express();

// Load passport config
require('./api/loaders/passport');

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(config.API.prefix, routes());

app.use(errors.validationError);
app.use(errors.forbiddenErrorHandler);
app.use(errors.appErrorHandler);
app.use(errors.notDefinedErrors);
app.use(errors.errorHandler);
app.use(errors.notFoundHandler);

module.exports = app;
