const { Joi, Segments } = require('celebrate');

const login = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  })
};

const signUp = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
      .required(),
    name: Joi.string()
      .max(255)
      .required()
  })
};

const forgotPassword = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
  })
};

const resetPassword = {
  [Segments.QUERY]: Joi.object().keys({
    userId: Joi.number()
      .positive()
      .required(),
    token: Joi.string().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
      .required()
  })
};

const checkAvailable = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
  })
};

module.exports = {
  login,
  signUp,
  forgotPassword,
  resetPassword,
  checkAvailable
};
