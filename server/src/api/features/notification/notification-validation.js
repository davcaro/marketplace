const { Joi, Segments } = require('celebrate');

const notificationTypes = {
  [Segments.BODY]: Joi.object().keys({
    type: Joi.valid(
      'new_message',
      'favorite',
      'review',
      'pending_review',
      'all'
    ).required()
  })
};

module.exports = {
  notificationTypes
};
