const jwt = require('jsonwebtoken');
const User = require('../models/mongoose/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization
  ) {
    try {
      if (
        req.headers.authorization.startsWith('Bearer') ||
        req.headers.authorization.startsWith('JWT')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } else {
        token = req.headers.authorization;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({message: 'Not authorized'});
    }
  }

  if (!token) {
    res.status(401).json({message: 'Not authorized, no token'});
  }
};

module.exports = {protect};
