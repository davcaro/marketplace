const passport = require('passport');
const boom = require('@hapi/boom');

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || info) {
      next(boom.unauthorized('Expired or invalid token'));
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
};
