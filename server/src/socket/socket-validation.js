const { Joi } = require('celebrate');

const createMessage = Joi.object().keys({
  chatId: Joi.number()
    .positive()
    .required(),
  message: Joi.string().required()
});

const markMessagesRead = Joi.object().keys({
  chatId: Joi.number()
    .positive()
    .required()
});

module.exports = {
  createMessage,
  markMessagesRead
};
