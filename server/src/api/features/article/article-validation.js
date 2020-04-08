const { Joi, Segments } = require('celebrate');

const create = {
  [Segments.BODY]: Joi.object().keys({
    categoryId: Joi.number().required(),
    title: Joi.string()
      .max(50)
      .required(),
    description: Joi.string()
      .max(650)
      .required(),
    price: Joi.number()
      .positive()
      .max(999999.99)
      .precision(2)
      .required(),
    location: Joi.string()
      .max(255)
      .required(),
    condition: Joi.string()
      .valid('new', 'like_new', 'good', 'fair', 'poor')
      .required(),
    images: Joi.array()
      .items(Joi.string())
      .required()
  })
};

const update = {
  [Segments.BODY]: Joi.object().keys({
    categoryId: Joi.number(),
    title: Joi.string().max(50),
    description: Joi.string().max(650),
    price: Joi.number()
      .positive()
      .max(999999.99)
      .precision(2),
    location: Joi.string().max(255),
    status: Joi.string().valid('for_sale', 'reserved', 'sold'),
    condition: Joi.string().valid('new', 'like_new', 'good', 'fair', 'poor'),
    images: Joi.array().items(Joi.string())
  })
};

module.exports = {
  create,
  update
};
