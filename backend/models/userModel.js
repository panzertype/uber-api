const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
      role: {
        type: String,
        enum: ['SHIPPER', 'DRIVER'],
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: {createdAt: 'created_date', updatedAt: false},
    },
);

module.exports = mongoose.model('User', schema);
