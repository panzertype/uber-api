const register = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const login = (req, res) => {
  res.status(200).json({message: 'Success'});
};

const forgotPassword = (req, res) => {
  res.status(200).json({message: 'Success'});
};

module.exports = {
  register,
  login,
  forgotPassword,
};
