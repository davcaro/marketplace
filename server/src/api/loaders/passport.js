const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const boom = require('@hapi/boom');

const { User } = require('../../db/models');
const config = require('../../config');

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        // Check if users exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(boom.notFound('User not found'));
        }

        // Check credentials
        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(boom.unauthorized('Bad credentials'));
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: config.ENV.JWT_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (payload, done) => {
      try {
        // Check if user exists
        const user = await User.findOne({ where: { email: payload.user } });

        if (!user) {
          return done(boom.notFound('User not found'));
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
