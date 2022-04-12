const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {
  getProfileInfo,
  deleteProfile,
  changePassword,
} = require('../controllers/usersController');

router.get('/', getProfileInfo);

router.delete('/', deleteProfile);

router.patch('/password', changePassword);

module.exports = router;
