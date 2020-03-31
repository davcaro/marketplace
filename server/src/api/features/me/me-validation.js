const { Joi, Segments } = require('celebrate');

const update = {
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')),
    name: Joi.string().max(255)
  })
};

module.exports = {
  update
};
