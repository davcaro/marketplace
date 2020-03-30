const EscapeHtml = require('escape-html');
const logger = require('../loaders/logger');

const handleError = err => {
  return logger.error(err.message);
};

const parseCelebrateError = err => {
  const { joi, meta } = err;

  const result = {
    statusCode: 400,
    error: 'Bad Request',
    message: joi.message,
    validation: {
      source: meta.source,
      keys: []
    }
  };

  if (joi.details) {
    for (let i = 0; i < joi.details.length; i += 1) {
      const path = joi.details[i].path.join('.');
      result.validation.keys.push(EscapeHtml(path));
    }
  }

  return result;
};

module.exports = {
  handleError,
  parseCelebrateError
};
