const { Joi } = require('celebrate');

const createMessage = Joi.object().keys({
  chatId: Joi.number()
    .positive()
    .required(),
  message: Joi.string().required()
});

module.exports = {
  createMessage
};
