const joi = require('joi');

exports.truckValidator = (data) => {
  const schema = joi.object({
    _id: joi.string().required(),
    created_by: joi.string().required(),
    assigned_to: joi.string().required(),
    type: joi
        .string()
        .valid('SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT')
        .required(),
    status: joi.string().valid('OL', 'IS').required(),
    created_date: joi.string().date().required(),
  });

  return schema.validate(data, {abortEarly: false});
};
