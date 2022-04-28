const User = require('../models/mongoose/userModel');
const Roles = require('../models/rolesModel');
const Truck = require('../models/mongoose/truckModel');
const Load = require('../models/mongoose/loadModel');
const LoadModel = require('../models/loadModel');
const TruckModel = require('../models/truckModel');
const bcrypt = require('bcrypt');
const {
  passwordChangeValidator,
} = require('../validators/passwordChangeValidator');
const {joiErrorHandler} = require('../utils/joiErrorHandler');

const getProfileInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const user = await User.findById(req.user._id).select('-__v -password');

    if (user) {
      res.status(200).json({user});
    } else {
      res.status(400).json({
        message: 'User does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const deleteProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      if (user.role === Roles.driver) {
        const truck = await Truck.findOne({
          created_by: req.user._id,
          status: TruckModel.status.on_load,
        });
        if (truck) {
          return res.status(400).json({message: 'You can not do it now'});
        }
        await Truck.deleteMany({created_by: req.user._id});
      } else if (user.role === Roles.shipper) {
        const load = await Load.findOne({
          created_by: req.user._id,
          $or: [
            {status: LoadModel.status.posted},
            {status: LoadModel.status.assigned},
          ],
        });
        if (load) {
          return res.status(400).json({message: 'You can not do it now'});
        }
        await Load.deleteMany({created_by: req.user._id});
      }

      await user.remove();
      console.log('Profile deleted successfully');
      res.status(200).json({message: 'Profile deleted successfully'});
    } else {
      res.status(400).json({
        message: 'User does not exist',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const changePassword = async (req, res) => {
  const {oldPassword, newPassword} = req.body;
  try {
    const {error} = passwordChangeValidator(req.body);
    if (error) {
      const errorL = joiErrorHandler(error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    }

    if (!req.user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      const response = await bcrypt.compare(oldPassword, user.password);
      if (response) {
        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        await user.save();
        console.log('Password changed successfully');
        res.status(200).json({message: 'Password changed successfully'});
      } else {
        res.status(400).json({message: 'Incorrect password'});
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

module.exports = {
  getProfileInfo,
  deleteProfile,
  changePassword,
};
