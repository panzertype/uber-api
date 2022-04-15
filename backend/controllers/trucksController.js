const Truck = require('../models/mongoose/truckModel');
const TruckModel = require('../models/truckModel');
const {truckValidator} = require('../validators/truckValidator');
const {pathValidator} = require('../validators/pathValidator');
const {joiErrorHandler} = require('../utils/joiErrorHandler');

const getUserTrucks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const trucks = await Truck.find({created_by: req.user._id}).select('-__v');

    res.status(200).json({trucks});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const addUserTruck = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const newTruck = {
      created_by: req.user._id,
      type: req.body.type,
    };

    const {error} = truckValidator(newTruck, ['created_by', 'type']);
    if (error) {
      const errorL = joiErrorHandler(error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    } else {
      const truck = new Truck(newTruck);
      await truck.save();

      res.status(200).json({message: 'Truck created successfully'});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const getUserTruckById = async (req, res) => {
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

    const truck = await Truck.findOne({
      created_by: req.user._id,
      _id: req.params.id,
    }).select('-__v');

    if (truck) {
      res.status(200).json({truck});
    } else {
      return res.status(400).json({
        message: 'Truck does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const updateUserTruckById = async (req, res) => {
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

    if (!Object.values(TruckModel.type).some((key) => key === req.body.type)) {
      return res.status(400).json({
        message: 'Wrong type format',
      });
    }

    const {error} = truckValidator(req.body, ['type']);
    if (error) {
      const errorL = joiErrorHandler(error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    }

    const truck = await Truck.findOne({
      created_by: req.user._id,
      _id: req.params.id,
    });

    if (truck.type === req.body.type) {
      return res.status(400).json({
        message: 'Use different type',
      });
    }

    if (truck) {
      truck.type = req.body.type;
      await truck.save();
      res.status(200).json({
        message: 'Truck details changed successfully',
      });
    } else {
      res.status(400).json({
        message: 'Truck does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const deleteUserTruckById = async (req, res) => {
  try {
    if (req.params.id.length !== 24 || pathValidator(req.params.id).error) {
      return res.status(400).json({
        message: 'Wrong parameter format',
      });
    }

    const truck = await Truck.findById(req.params.id);

    if (truck) {
      await truck.remove();
      res.status(200).json({message: 'Truck deleted successfully'});
    } else {
      res.status(400).json({
        message: 'Truck does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const assignUserTruckById = async (req, res) => {
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

    const truck = await Truck.findOne({
      _id: req.params.id,
    });

    if (truck && !truck.assigned_to) {
      const oldAssignedTruck = await Truck.findOne({
        assigned_to: req.user._id,
      });

      if (
        oldAssignedTruck &&
        oldAssignedTruck.assigned_to === truck.assigned_to
      ) {
        return res.status(400).json({message: 'Truck is already assigned'});
      }

      if (
        oldAssignedTruck &&
        oldAssignedTruck.status !== TruckModel.status.on_load
      ) {
        const updateTruck = {
          assigned_to: null,
          status: null,
        };

        const {error} = truckValidator(updateTruck, ['assigned_to', 'status']);

        if (error) {
          const errorL = joiErrorHandler(error);
          if (errorL) {
            return res.status(400).json(errorL);
          } else {
            return res.status(500).json({message: 'Internal server error'});
          }
        }

        oldAssignedTruck.assigned_to = updateTruck.assigned_to;
        oldAssignedTruck.status = updateTruck.status;
        await oldAssignedTruck.save();
      }

      const updateTruck = {
        assigned_to: req.user._id,
        status: TruckModel.status.in_service,
      };

      const {error} = truckValidator(updateTruck, ['assigned_to', 'status']);
      if (error) {
        const errorL = joiErrorHandler(error);
        if (errorL) {
          return res.status(400).json(errorL);
        } else {
          return res.status(500).json({message: 'Internal server error'});
        }
      }

      truck.assigned_to = updateTruck.assigned_to;
      truck.status = updateTruck.status;

      await truck.save();
      res.status(200).json({
        message: 'Truck assigned successfully',
      });
    } else {
      const oldAssignedTruck = await Truck.findOne({
        assigned_to: req.user._id,
      });

      if (
        oldAssignedTruck &&
        oldAssignedTruck.assigned_to.toString() === truck.assigned_to.toString()
      ) {
        return res.status(400).json({message: 'Truck is already assigned'});
      }

      res.status(400).json({
        message: 'Truck does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

module.exports = {
  getUserTrucks,
  addUserTruck,
  getUserTruckById,
  updateUserTruckById,
  deleteUserTruckById,
  assignUserTruckById,
};
