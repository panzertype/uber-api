const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.post('/login', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.post('/forgot_password', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

module.exports = router;
