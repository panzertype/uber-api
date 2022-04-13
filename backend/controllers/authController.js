const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const {
  registrationCredentialsValidator,
} = require('../validators/registrationCredentialsValidator');
const {credentialsValidator} = require('../validators/credentialsValidator');
const {joiErrorHandler} = require('../utils/joiErrorHandler');
const {userValidator} = require('../validators/userValidator');

const genToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const register = async (req, res) => {
  const {password, email, role} = req.body;
  try {
    const {error} = registrationCredentialsValidator(req.body);
    if (error) {
      const errorL = joiErrorHandler(error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    }

    const userExists = await User.findOne({email});
    if (userExists) {
      return res
          .status(400)
          .json({message: 'Account with this email already exists'});
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      role,
      email,
      password: hash,
    };

    const {userError} = userValidator(newUser);
    if (userError) {
      const errorL = joiErrorHandler(userError);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    } else {
      const user = new User(newUser);
      await user.save();
    }

    res.status(200).json({message: 'Profile created successfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

const login = async (req, res) => {
  const {password, email} = req.body;
  try {
    const {error} = credentialsValidator(req.body);
    if (error) {
      const errorL = joiErrorHandler(error);
      if (errorL) {
        return res.status(400).json(errorL);
      } else {
        return res.status(500).json({message: 'Internal server error'});
      }
    }

    const user = await User.findOne({email});
    if (user) {
      const response = await bcrypt.compare(password, user.password);
      if (response) {
        res.status(200).json({jwt_token: genToken(user._id)});
      } else {
        res.status(400).json({message: 'Invalid email or password'});
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  }
};

// const forgotPassword = (req, res) => {
//   res.status(200).json({message: 'Success'});
// };

module.exports = {
  register,
  login,
};
