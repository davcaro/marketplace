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
      .required()
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
  updateChat
};
