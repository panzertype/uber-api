const getProfileInfo = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const deleteProfile = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const changePassword = (req, res) => {
  res.status(200).json({message: 'Success'});
};

module.exports = {
  getProfileInfo,
  deleteProfile,
  changePassword,
};
