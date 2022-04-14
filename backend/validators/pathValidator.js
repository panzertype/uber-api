const joi = require('joi');

exports.pathValidator = (data) => {
  const schema = joi.string().alphanum().required();

  return schema.validate(data, {abortEarly: false});
};
