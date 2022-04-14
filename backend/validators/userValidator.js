const joi = require('joi');

exports.userValidator = (data) => {
  const schema = joi.object({
    _id: joi.string().required(),
    role: joi.string().valid('SHIPPER', 'DRIVER').required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    created_date: joi.date().timestamp().required(),
  });

  return schema.validate(data, {abortEarly: false});
};
