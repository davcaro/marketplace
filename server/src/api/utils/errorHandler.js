const logger = require('../loaders/logger');

const handleError = err => {
  return logger.error(err.message);
};

module.exports = {
  handleError
};
