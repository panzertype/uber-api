const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
} = require('../controllers/authController');

router.post('/register', register);

router.post('/login', login);

router.post('/forgot_password', forgotPassword);

module.exports = router;
