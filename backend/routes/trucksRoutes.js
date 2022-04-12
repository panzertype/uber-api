const express = require('express');
const router = express.Router();
const {
  getUserTrucks,
  addUserTruck,
  getUserTruckById,
  updateUserTruckById,
  deleteUserTruckById,
  assignUserTruckById,
} = require('../controllers/trucksController');

router.get('/', getUserTrucks);

router.post('/', addUserTruck);

router.get('/:id', getUserTruckById);

router.put('/:id', updateUserTruckById);

router.delete('/:id', deleteUserTruckById);

router.post('/:id/assign', assignUserTruckById);

module.exports = router;
