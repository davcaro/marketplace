const { Joi, Segments } = require('celebrate');

const notificationTypes = {
  type: Joi.valid(
    'new_message',
    'favorite',
    'review',
    'pending_review',
    'all'
  ).required()
};

const notificationTypesQuery = {
  [Segments.QUERY]: Joi.object().keys(notificationTypes)
};

const notificationTypesBody = {
  [Segments.BODY]: Joi.object().keys(notificationTypes)
};

module.exports = {
  notificationTypesQuery,
  notificationTypesBody
};
