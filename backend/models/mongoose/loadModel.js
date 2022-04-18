const mongoose = require('mongoose');
const Load = require('../loadModel');

const dimensionsSchema = new mongoose.Schema({
  width: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
}, {_id: false});

const logSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}, {_id: false});

const MainSchema = new mongoose.Schema(
    {
      created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'User',
      },
      status: {
        type: String,
        enum: [
          Load.status.new,
          Load.status.posted,
          Load.status.assigned,
          Load.status.shipped,
        ],
        required: true,
      },
      state: {
        type: String,
        enum: [
          Load.state.driving_to_pick_up,
          Load.state.picking_up,
          Load.state.delivering,
          Load.state.delivered,
          null,
        ],
        default: null,
      },
      payload: {
        type: Number,
        required: true,
      },
      pickup_address: {
        type: String,
        required: true,
      },
      delivery_address: {
        type: String,
        required: true,
      },
      dimensions: {
        type: dimensionsSchema,
        required: true,
      },
      logs: {
        type: [logSchema],
        default: [],
      },
    },
    {
      timestamps: {createdAt: 'created_date', updatedAt: false},
    },
);

module.exports = mongoose.model('Load', MainSchema);
