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
    name: Joi.string().required()
  })
};

module.exports = {
  login,
  signUp
};
