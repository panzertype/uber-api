const express = require('express');
const Roles = require('../models/rolesModel');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  getUserTrucks,
  addUserTruck,
  getUserTruckById,
  updateUserTruckById,
  deleteUserTruckById,
  assignUserTruckById,
} = require('../controllers/trucksController');
const {protect} = require('../middleware/authMiddleware');
const {accessFor} = require('../middleware/accessForMiddleware');

router.get('/', [protect, accessFor(Roles.driver)], getUserTrucks);

router.post('/', [protect, accessFor(Roles.driver)], addUserTruck);

router.get('/:id', [protect, accessFor(Roles.driver)], getUserTruckById);

router.put('/:id', [protect, accessFor(Roles.driver)], updateUserTruckById);

router.delete('/:id', [protect, accessFor(Roles.driver)], deleteUserTruckById);

router.post(
    '/:id/assign',
    [protect, accessFor(Roles.driver)],
    assignUserTruckById,
);

module.exports = router;
