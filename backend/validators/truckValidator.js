const joi = require('joi');

exports.truckValidator = (data, requiredFields = []) => {
  let schema = joi.object({
    created_by: joi.object(),
    assigned_to: [joi.object(), joi.string().allow(null)],
    type: joi.string().valid('SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'),
    status: [joi.string().valid('OL', 'IS'), joi.string().allow(null)],
  });

  schema = schema.fork(requiredFields, (field) => field.required());

  return schema.validate(data, {
    requiredFields: requiredFields,
    abortEarly: false,
  });
};
