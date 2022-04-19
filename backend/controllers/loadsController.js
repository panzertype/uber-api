const Load = require('../models/mongoose/loadModel');
const Truck = require('../models/mongoose/truckModel');
const loadModel = require('../models/loadModel');
const truckModel = require('../models/truckModel');
const {loadValidator} = require('../validators/loadValidator');
const {joiErrorHandler} = require('../utils/joiErrorHandler');
const {canFit} = require('../utils/canFit');
const {pathValidator} = require('../validators/pathValidator');

const getUserLoads = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const urlString = req.protocol + '://' + req.hostname + req.originalUrl;
    const url = new URL(urlString);
    const status = url.searchParams.get('status');
    const offset = +url.searchParams.get('offset') || 0;
    const limit = +url.searchParams.get('limit') || 10;

    const {error} = loadValidator({status}, ['status']);

    if (error) {
      const errorL = joiErrorHandler(error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    }

    if (status) {
      const loads = await Load.find({created_by: req.user._id, status})
          .skip(offset)
          .limit(limit)
          .select('-__v');

      res.status(200).json({loads});
    } else {
      const loads = await Load.find({created_by: req.user._id})
          .skip(offset)
          .limit(limit)
          .select('-__v');

      res.status(200).json({loads});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
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

const getUserActiveLoad = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const load = await Load.findOne({
      assigned_to: req.user._id,
      status: loadModel.status.assigned,
    }).select('-__v');

    if (load) {
      res.status(200).json({load});
    } else {
      res.status(400).json({message: 'No active loads'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const iterateNextLoadState = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const states = Object.values(loadModel.state);
    const load = await Load.findOne({assigned_to: req.user._id});
    const stage = states.indexOf(load.state);

    if (stage < states.length - 2) {
      load.state = states[stage + 1];
      const time = new Date();
      load.logs.push({
        message: `Load state changed to ${states[stage + 1]}`,
        time: time.toISOString(),
      });
      await load.save();

      res
          .status(200)
          .json({message: `Load state changed to ${states[stage + 1]}`});
    } else if (stage === states.length - 2) {
      load.state = states[stage + 1];
      load.status = loadModel.status.shipped;
      const time = new Date();
      load.logs.push({
        message: `Load state changed to ${states[stage + 1]}`,
        time: time.toISOString(),
      });
      await load.save();

      const truck = await Truck.findOne({assigned_to: req.user._id});
      truck.status = truckModel.status.in_service;
      await truck.save();

      res
          .status(200)
          .json({message: `Load state changed to ${states[stage + 1]}`});
    } else {
      res.status(400).json({message: 'No active loads'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const getUserLoadById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    if (req.params.id.length !== 24 || pathValidator(req.params.id).error) {
      return res.status(400).json({
        message: 'Wrong parameter format',
      });
    }

    const load = await Load.findOne({
      created_by: req.user._id,
      _id: req.params.id,
    }).select('-__v');

    if (load) {
      res.status(200).json({load});
    } else {
      return res.status(400).json({
        message: 'Load does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const updateUserLoadById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    if (req.params.id.length !== 24 || pathValidator(req.params.id).error) {
      return res.status(400).json({
        message: 'Wrong parameter format',
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

    const load = await Load.findOne({
      created_by: req.user._id,
      _id: req.params.id,
    });

    if (load) {
      if (load.assigned_to !== null || load.status !== loadModel.status.new) {
        return res.status(400).json({message: 'You can not do it now'});
      }

      load.name = req.body.name;
      load.payload = req.body.payload;
      load.pickup_address = req.body.pickup_address;
      load.delivery_address = req.body.delivery_address;
      load.dimensions = req.body.dimensions;

      await load.save();
      res.status(200).json({
        message: 'Load details changed successfully',
      });
    } else {
      res.status(400).json({
        message: 'Load does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const deleteUserLoadById = async (req, res) => {
  try {
    if (req.params.id.length !== 24 || pathValidator(req.params.id).error) {
      return res.status(400).json({
        message: 'Wrong parameter format',
      });
    }

    const load = await Load.findById(req.params.id);

    if (load) {
      if (load.assigned_to !== null || load.status !== loadModel.status.new) {
        return res.status(400).json({message: 'You can not do it now'});
      }
      await load.remove();
      res.status(200).json({message: 'Load deleted successfully'});
    } else {
      res.status(400).json({
        message: 'Load does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const postUserLoadById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    if (req.params.id.length !== 24 || pathValidator(req.params.id).error) {
      return res.status(400).json({
        message: 'Wrong parameter format',
      });
    }

    const load = await Load.findOne({
      created_by: req.user._id,
      _id: req.params.id,
    });

    if (!load) {
      return res.status(400).json({
        message: 'Load does not exist',
      });
    }

    if (load.status !== loadModel.status.new) {
      return res.status(400).json({
        message: 'Load already posted',
      });
    }

    const maxPayload = Math.max(...Object.values(truckModel.payload));
    if (load.payload > maxPayload) {
      return res
          .status(400)
          .json({message: 'Exceeded max payload size', driver_found: false});
    }

    const trucksThatCanFit = [];
    const truckModels = Object.keys(truckModel.dimensions);

    for (const truck of truckModels) {
      if (
        canFit(load.dimensions, truckModel.dimensions[truck]) &&
        load.payload <= truckModel.payload[truck]
      ) {
        trucksThatCanFit.push(truckModel.type[truck]);
      }
    }

    const optionsArr = [];
    if (trucksThatCanFit.length > 0) {
      for (const truck of trucksThatCanFit) {
        if (truck) {
          optionsArr.push({type: truck});
        }
      }
    }

    load.status = loadModel.status.posted;
    await load.save();

    const truck = await Truck.findOne({
      status: truckModel.status.in_service,
      $or: optionsArr,
    });

    if (truck) {
      truck.status = truckModel.status.on_load;
      load.assigned_to = truck.assigned_to;
      load.status = loadModel.status.assigned;
      load.state = loadModel.state.driving_to_pick_up;

      const time = new Date();
      load.logs.push({
        message: `Load assigned to driver with id ${truck.assigned_to}`,
        time: time.toISOString(),
      });

      await load.save();
      await truck.save();

      res
          .status(200)
          .json({message: 'Load posted successfully', driver_found: true});
    } else {
      load.status = loadModel.status.new;
      await load.save();

      res
          .status(400)
          .json({message: 'Unable to post a load', driver_found: false});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const getUserLoadShippingInfoById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    if (req.params.id.length !== 24 || pathValidator(req.params.id).error) {
      return res.status(400).json({
        message: 'Wrong parameter format',
      });
    }

    const load = await Load.findOne({
      created_by: req.user._id,
      _id: req.params.id,
    }).select('-__v');

    if (load.assigned_to) {
      const truck = await Truck.findOne({assigned_to: load.assigned_to}).select(
          '-__v',
      );
      if (truck) {
        res.status(200).json({load, truck});
      } else {
        res.status(400).json({message: 'Truck does not exist'});
      }
    } else {
      res.status(400).json({message: 'Load is not active'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
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
