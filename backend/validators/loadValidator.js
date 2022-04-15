const joi = require('joi');
const Truck = require('../models/truckModel');
const {canFit} = require('../utils/canFit');

exports.loadValidator = (data, requiredFields = []) => {
  const dimensionsSchema = joi.object({
    dimensions: joi.object({
      width: joi.number().integer().required(),
      length: joi.number().integer().required(),
      height: joi.number().integer().required(),
    }).required(),
  }).unknown();

  const dimensionV = dimensionsSchema.validate(data);

  if (dimensionV.error) {
    return dimensionV;
  }

  let fittable = false;
  Object.values(Truck.dimensions).forEach((el) => {
    if (canFit(data.dimensions, el)) {
      fittable = true;
    }
  });
  if (!fittable) {
    const pseudoJoiError = {
      error: {
        details: [
          {
            message: `Exceeded max dimension limit`,
          },
        ],
      },
    };
    return pseudoJoiError;
  }
  let schema = joi.object({
    created_by: joi.object(),
    assigned_to: [joi.object(), joi.string().allow(null)],
    status: joi.string().valid('NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'),
    state: joi
        .string()
        .valid(
            'En route to Pick Up',
            'Arrived to Pick Up',
            'En route to delivery',
            'Arrived to delivery',
        ),
    name: joi.string(),
    payload: joi
        .number()
        .integer()
        .min(1)
        .max(Math.max(...Object.values(Truck.payload))),
    pickup_address: joi.string(),
    delivery_address: joi.string(),
    dimensions: joi.object({
      width: joi.number().integer().required(),
      length: joi.number().integer().required(),
      height: joi.number().integer().required(),
    }),
    logs: joi.array().items(
        joi.object({
          message: joi.string().required(),
          time: joi.date().timestamp().required(),
        }),
    ),
    created_date: joi.date().timestamp(),
  });

  schema = schema.fork(requiredFields, (field) => field.required());

  return schema.validate(data, {
    requiredFields: requiredFields,
    abortEarly: false,
  });
};
