const { Joi, Segments } = require('celebrate');

const create = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .max(255)
      .required(),
    icon: Joi.string()
      .max(255)
      .required()
  })
};

const update = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().max(255),
    icon: Joi.string().max(255)
  })
};

module.exports = {
  create,
  update
};
