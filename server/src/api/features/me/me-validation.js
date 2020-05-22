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
      placeName: Joi.string().required()
    })
  })
};

const getReviews = {
  [Segments.QUERY]: Joi.object().keys({
    pending: Joi.valid('0', '1')
  })
};

const updateReview = {
  [Segments.BODY]: Joi.object().keys({
    score: Joi.number()
      .min(0)
      .max(5)
      .precision(1),
    description: Joi.string()
  })
};

const getStatistics = {
  [Segments.QUERY]: Joi.object().keys({
    data: Joi.valid('items-month', 'items-categories')
  })
};

module.exports = {
  update,
  getReviews,
  updateReview,
  getStatistics
};
