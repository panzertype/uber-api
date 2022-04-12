const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.get('/active', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.patch('/active/state', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.post('/:id/post', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

router.get('/:id/shipping_info', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

module.exports = router;
