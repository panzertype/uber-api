const joi = require('joi');

exports.userValidator = (data) => {
  const schema = joi.object({
    _id: joi.string().required(),
    role: joi.string().valid('SHIPPER', 'DRIVER').required(),
    email: joi.string().email().required(),
    created_date: joi.string().date().required(),
  });

  return schema.validate(data);
};
