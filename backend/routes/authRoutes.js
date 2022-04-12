const express = require('express');
const router = express.Router();
const { register, login, forgotPassword } = require('../routes/authRoutes');

router.post('/register', register);

router.post('/login', login);

router.post('/forgot_password', forgotPassword);

module.exports = router;
