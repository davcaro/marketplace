const { Joi, Segments } = require('celebrate');

const createMessage = {
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required()
  })
};

const findChat = {
  [Segments.QUERY]: Joi.object().keys({
    itemId: Joi.number()
      .positive()
      .required(),
    limit: Joi.number().min(0),
    offset: Joi.number().min(0)
  })
};

const getMessages = {
  [Segments.QUERY]: Joi.object().keys({
    limit: Joi.number().min(0),
    offset: Joi.number().min(0)
  })
};

const updateChat = {
  [Segments.BODY]: Joi.object().keys({
    archived: Joi.boolean().required()
  })
};

module.exports = {
  createMessage,
  findChat,
  getMessages,
  updateChat
};
