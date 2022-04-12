const joi = require('joi');

exports.errorValidator = (data) => {
  const schema = joi.object({
    message: joi.string().required(),
  });

  return schema.validate(data);
};
