class AppError extends Error {
  constructor(httpCode, message, isOperational = true, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.name = 'AppError';
    this.isAppError = true;
    this.statusCode = httpCode;
    this.message = message;
    this.isOperational = isOperational;
    this.date = new Date();
  }
}

module.exports = AppError;
