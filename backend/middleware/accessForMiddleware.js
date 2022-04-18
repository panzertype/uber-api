const accessFor = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({message: 'Not authorized'});
      }
      if (req.user.role === role) {
        next();
      } else {
        res.status(400).json({message: 'Unsufficient role permissions'});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: 'Internal server error'});
    }
  };
};

module.exports = {accessFor};
