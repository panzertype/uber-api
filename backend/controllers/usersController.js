const User = require('../models/userModel');
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
      console.log('ERROR 400: User does not exist');
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
      await user.remove();
      res.status(200).json({message: 'Profile deleted successfully'});
    } else {
      console.log('ERROR 400: User does not exist');
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
