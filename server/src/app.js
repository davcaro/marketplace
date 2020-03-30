const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const config = require('./config');
const routes = require('./api');

const app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(config.API.prefix, routes());

module.exports = app;
