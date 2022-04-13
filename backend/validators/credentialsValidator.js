const joi = require('joi');

exports.credentialsValidator = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  return schema.validate(data, {abortEarly: false});
};
