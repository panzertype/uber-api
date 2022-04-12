const express = require('express');
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

router.get('/', getUserLoads);

router.post('/', addUserLoad);

router.get('/active', getUserActiveLoad);

router.patch('/active/state', iterateNextLoadState);

router.get('/:id', getUserLoadById);

router.put('/:id', updateUserLoadById);

router.delete('/:id', deleteUserLoadById);

router.post('/:id/post', postUserLoadById);

router.get('/:id/shipping_info', getUserLoadShippingInfoById);

module.exports = router;
