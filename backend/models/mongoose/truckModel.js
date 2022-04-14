const mongoose = require('mongoose');
const Truck = require('../truckModel');

const schema = new mongoose.Schema(
    {
      created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      type: {
        type: String,
        enum: [
          Truck.type.sprinter,
          Truck.type.small_straight,
          Truck.type.large_straight,
        ],
        required: true,
      },
      status: {
        type: String,
        enum: [Truck.status.on_load, Truck.status.in_service, null],
        default: null,
      },
    },
    {
      timestamps: {createdAt: 'created_date', updatedAt: false},
    },
);

module.exports = mongoose.model('Truck', schema);
