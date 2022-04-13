const joi = require('joi');

exports.passwordChangeValidator = (data) => {
  const schema = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().invalid(joi.ref('oldPassword')).required(),
  });

  return schema.validate(data, {abortEarly: false});
};
