const { Joi, Segments } = require('celebrate');

const update = {
  [Segments.BODY]: Joi.object().keys({
    currentPassword: Joi.string().when('newPassword', {
      is: Joi.exist(),
      then: Joi.required()
    }),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
    name: Joi.string().max(255),
    location: Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      zoom: Joi.number().required(),
      place_name: Joi.string().required()
    })
  })
};

module.exports = {
  update
};
