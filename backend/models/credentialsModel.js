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
    },
    {
      timestamps: {createdAt: 'created_date', updatedAt: false},
    },
);

module.exports = mongoose.model('Credentials', schema);
