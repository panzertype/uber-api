const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['SHIPPER', 'DRIVER'],
        required: true,
      },
    },
    {
      timestamps: {createdAt: 'created_date', updatedAt: false},
    },
);

module.exports = mongoose.model('registrationCredentials', schema);
