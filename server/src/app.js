const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');

const app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
