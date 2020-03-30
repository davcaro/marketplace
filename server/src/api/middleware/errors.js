/* eslint-disable no-unused-vars */

const Boom = require('@hapi/boom');
const { handleError } = require('../utils/errorHandler');

const appErrorHandler = (err, req, res, next) => {
  if (err.isAppError) {
    return next(Boom.boomify(err, { statusCode: err.statusCode }));
  }

  return next(err);
};

const notDefinedErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    return next(Boom.badImplementation(err));
  }

  return next(err);
};

const errorHandler = (err, req, res, next) => {
  handleError(err);
  return res.status(err.output.statusCode).json(err.output.payload);
};

const notFoundHandler = (req, res, next) => {
  const err = Boom.notFound();
  return res.status(err.output.statusCode).json(err.output.payload);
};

module.exports = {
  appErrorHandler,
  notDefinedErrors,
  errorHandler,
  notFoundHandler
};
