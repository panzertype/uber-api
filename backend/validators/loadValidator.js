const joi = require('joi');

exports.loadValidator = (data) => {
  const schema = joi.object({
    _id: joi.string().required(),
    creatd_by: joi.string().required(),
    assigned_to: joi.string().required(),
    status: joi
        .string()
        .valid('NEW', 'POSTED', 'ASSIGNED', 'SHIPPED')
        .required(),
    state: joi
        .string()
        .valid(
            'En route to Pick Up',
            'Arrived to Pick Up',
            'En route to delivery',
            'Arrived to delivery',
        )
        .required(),
    name: joi.string().required(),
    payload: joi.number().required(),
    pickup_address: joi.string().required(),
    delivery_address: joi.string().required(),
    dimensions: joi.object({
      width: joi.number().required(),
      length: joi.number().required(),
      height: joi.number().required(),
    }).required(),
    logs: joi
        .array()
        .items(
            joi.object({
              message: joi.string().required(),
              time: joi.string().date().required(),
            }),
        )
        .min(1)
        .required(),
    created_date: joi.string().date().required(),
  });

  return schema.validate(data, {abortEarly: false});
};
