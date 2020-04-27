const { Joi, Segments } = require('celebrate');

const create = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
      .required(),
    name: Joi.string()
      .max(255)
      .required(),
    location: Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      zoom: Joi.number().required(),
      placeName: Joi.string().required()
    })
  })
};

const update = {
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
    name: Joi.string().max(255),
    location: Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      zoom: Joi.number().required(),
      placeName: Joi.string().required()
    }),
    admin: Joi.boolean()
  })
};

module.exports = {
  create,
  update
};
