const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['PRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
      required: true,
    },
    status: {
      type: String,
      enum: ['OL', 'IS'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_date', updatedAt: false },
  }
);

module.exports = mongoose.model('Truck', schema);
