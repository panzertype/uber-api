const express = require('express');
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
