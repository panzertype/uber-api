const joi = require('joi');

exports.registrationCredentialsValidator = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    role: joi.string().valid('SHIPPER', 'DRIVER').required(),
  });

  return schema.validate(data);
};
