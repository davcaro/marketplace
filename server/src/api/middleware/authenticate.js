/* eslint-disable no-unused-vars */

const passport = require('passport');
const { AbilityBuilder, Ability, ForbiddenError } = require('@casl/ability');
const boom = require('@hapi/boom');

const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  CRUD: 'crud'
};

const SUBJECTS = {
  ALL: 'all',
  SELF_USER: 'self_user',
  USER: 'User',
  PASSWORD_RESET: 'Password Reset',
  CATEGORY: 'Category',
  ITEM: 'Item',
  FAVORITE: 'ItemFavorite',
  VIEW: 'ItemView',
  CHAT: 'Chat',
  MESSAGE: 'ChatMessage',
  REVIEW: 'Review',
  NOTIFICATION: 'Notification'
};

function defineAbilitiesFor(user) {
  const { rules, can: allow, cannot: forbid } = AbilityBuilder.extract();

  if (user) {
    if (user.isAdmin()) {
      allow(ACTIONS.MANAGE, SUBJECTS.ALL);
    } else {
      allow(ACTIONS.READ, SUBJECTS.USER);

      allow(ACTIONS.READ, SUBJECTS.SELF_USER);
      allow(ACTIONS.UPDATE, SUBJECTS.SELF_USER);
      allow(ACTIONS.DELETE, SUBJECTS.SELF_USER);

      allow(ACTIONS.CRUD, SUBJECTS.ITEM);
      allow(ACTIONS.CRUD, SUBJECTS.FAVORITE);
      allow(ACTIONS.CREATE, SUBJECTS.VIEW);
      allow(ACTIONS.CRUD, SUBJECTS.CHAT);
      allow(ACTIONS.CRUD, SUBJECTS.MESSAGE);
      allow(ACTIONS.CRUD, SUBJECTS.REVIEW);
      allow(ACTIONS.CRUD, SUBJECTS.NOTIFICATION);
    }
  } else {
    allow(ACTIONS.CREATE, SUBJECTS.USER);
    allow(ACTIONS.READ, SUBJECTS.USER);
    allow(ACTIONS.READ, SUBJECTS.ITEM);
    allow(ACTIONS.READ, SUBJECTS.FAVORITE);
    allow(ACTIONS.READ, SUBJECTS.REVIEW);
    allow(ACTIONS.CREATE, SUBJECTS.PASSWORD_RESET);
    allow(ACTIONS.UPDATE, SUBJECTS.PASSWORD_RESET);
  }

  return new Ability(rules);
}

const isAuthorized = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || info) {
      next(boom.unauthorized('Expired or invalid token'));
    } else {
      req.logIn(user, { session: false }, next);
    }
  })(req, res, next);
};

const hasPermission = (action, subject, field) => (req, res, next) => {
  try {
    const { user } = req;
    req.ability = user ? defineAbilitiesFor(user) : defineAbilitiesFor(null);
    ForbiddenError.from(req.ability).throwUnlessCan(action, subject, field);
    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  isAuthorized,
  hasPermission,
  ACTIONS,
  SUBJECTS
};
