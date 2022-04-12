const express = require('express');
const router = express.Router();
const {
  getProfileInfo,
  deleteProfile,
  changePassword,
} = require('../routes/usersRoutes');

router.get('/', getProfileInfo);

router.delete('/', deleteProfile);

router.patch('/password', changePassword);

module.exports = router;
