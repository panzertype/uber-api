const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.delete('/', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.patch('/password', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

module.exports = router;
