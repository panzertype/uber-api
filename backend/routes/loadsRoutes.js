const express = require('express');
const Roles = require('../models/rolesModel');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  getUserLoads,
  addUserLoad,
  getUserActiveLoad,
  iterateNextLoadState,
  getUserLoadById,
  updateUserLoadById,
  deleteUserLoadById,
  postUserLoadById,
  getUserLoadShippingInfoById,
} = require('../controllers/loadsController');
const {protect} = require('../middleware/authMiddleware');
const {accessFor} = require('../middleware/accessForMiddleware');

router.get('/', [protect, accessFor(Roles.shipper)], getUserLoads);

router.post('/', [protect, accessFor(Roles.shipper)], addUserLoad);

router.get('/active', [protect, accessFor(Roles.driver)], getUserActiveLoad);

router.patch(
    '/active/state',
    [protect, accessFor(Roles.driver)],
    iterateNextLoadState,
);

router.get('/:id', [protect, accessFor(Roles.shipper)], getUserLoadById);

router.put('/:id', [protect, accessFor(Roles.shipper)], updateUserLoadById);

router.delete('/:id', [protect, accessFor(Roles.shipper)], deleteUserLoadById);

router.post('/:id/post', [protect, accessFor(Roles.shipper)], postUserLoadById);

router.get(
    '/:id/shipping_info',
    [protect, accessFor(Roles.shipper)],
    getUserLoadShippingInfoById,
);

module.exports = router;
