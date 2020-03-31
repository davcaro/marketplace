const passport = require('passport');
const jwt = require('jsonwebtoken');

const authService = require('./auth-service');
const config = require('../../../config');

const login = async (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        return next(err);
      }

      return req.logIn(user, { session: false }, error => {
        if (error) {
          return next(error);
        }

        const body = {
          _id: user.id,
          user: user.email
        };

        // Need to append "s" to get time in seconds.
        const expiresIn = `${config.ENV.JWT_TTL}s`;

        // Generate the JWT token
        const token = jwt.sign(body, config.ENV.JWT_KEY, { expiresIn });

        return res.json({
          _id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          token,
          token_ttl: config.ENV.JWT_TTL
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const signUp = async (req, res, next) => {
  try {
    await authService.createUser(req.body);
  } catch (e) {
    return next(e);
  }

  return passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        return next(err);
      }

      return req.logIn(user, { session: false }, error => {
        if (error) {
          return next(error);
        }

        const body = {
          _id: user.id,
          user: user.email
        };

        // Need to append "s" to get time in seconds.
        const expiresIn = `${config.ENV.JWT_TTL}s`;

        // Generate the JWT token
        const token = jwt.sign(body, config.ENV.JWT_KEY, { expiresIn });

        return res.json({
          _id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          token,
          token_ttl: config.ENV.JWT_TTL
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

module.exports = {
  login,
  signUp
};
