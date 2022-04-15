const Load = require('../models/mongoose/loadModel');
const loadModel = require('../models/loadModel');
const {loadValidator} = require('../validators/loadValidator');
const {joiErrorHandler} = require('../utils/joiErrorHandler');

const getUserLoads = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const addUserLoad = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const {error} = loadValidator(req.body, [
      'name',
      'payload',
      'pickup_address',
      'delivery_address',
      'dimensions',
    ]);

    if (error) {
      const errorL = joiErrorHandler(error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    }

    const newLoad = {
      created_by: req.user._id,
      status: loadModel.status.new,
      name: req.body.name,
      payload: req.body.payload,
      pickup_address: req.body.pickup_address,
      delivery_address: req.body.delivery_address,
      dimensions: req.body.dimensions,
    };

    const vError = loadValidator(newLoad, [
      'created_by',
      'status',
      'name',
      'payload',
      'pickup_address',
      'delivery_address',
      'dimensions',
    ]);

    if (vError.error) {
      const errorL = joiErrorHandler(vError.error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    }

    const load = new Load(newLoad);
    await load.save();

    res.status(200).json({message: 'Load created successfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const getUserActiveLoad = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const iterateNextLoadState = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const getUserLoadById = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const updateUserLoadById = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const deleteUserLoadById = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const postUserLoadById = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const getUserLoadShippingInfoById = (req, res) => {
  res.status(200).json({message: 'Success'});
};

module.exports = {
  getUserLoads,
  addUserLoad,
  getUserActiveLoad,
  iterateNextLoadState,
  getUserLoadById,
  updateUserLoadById,
  deleteUserLoadById,
  postUserLoadById,
  getUserLoadShippingInfoById,
};
