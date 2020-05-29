const passport = require('passport');
const jwt = require('jsonwebtoken');

const authService = require('./auth-service');
const config = require('../../../config');
const { handleError: logError } = require('../../utils/errorHandler');

const login = async (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        return next(err);
      }

      return req.logIn(user, { session: false }, async error => {
        if (error) {
          return next(error);
        }

        const body = {
          id: user.id,
          user: user.email
        };

        // Need to append "s" to get time in seconds.
        const expiresIn = `${config.ENV.JWT_TTL}s`;

        // Generate the JWT token
        const token = jwt.sign(body, config.ENV.JWT_KEY, { expiresIn });

        let location;
        if (user.locationId) {
          location = await authService.readLocation(user.locationId);
        }

        return res.json({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          location,
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
  let newUser;

  try {
    newUser = await authService.createUser(req.body);
  } catch (e) {
    return next(e);
  }

  try {
    await authService.sendWelcomeMail(newUser);
  } catch (e) {
    logError(e);
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
          id: user.id,
          user: user.email
        };

        // Need to append "s" to get time in seconds.
        const expiresIn = `${config.ENV.JWT_TTL}s`;

        // Generate the JWT token
        const token = jwt.sign(body, config.ENV.JWT_KEY, { expiresIn });

        return res.json({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          location: user.location,
          token,
          token_ttl: config.ENV.JWT_TTL
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    await authService.createPasswordReset(email);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const resetPassword = async (req, res, next) => {
  const { userId, token } = req.query;
  const { password } = req.body;

  try {
    await authService.resetPassword(userId, token, password);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

const checkAvailable = async (req, res, next) => {
  const { email } = req.body;

  try {
    await authService.checkUserExists(email);

    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  login,
  signUp,
  forgotPassword,
  resetPassword,
  checkAvailable
};
