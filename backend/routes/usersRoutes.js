const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  getProfileInfo,
  deleteProfile,
  changePassword,
} = require('../controllers/usersController');
const {protect} = require('../middleware/authMiddleware');

router.get('/', protect, getProfileInfo);

router.delete('/', protect, deleteProfile);

router.patch('/password', protect, changePassword);

module.exports = router;
