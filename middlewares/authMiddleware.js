

const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

exports.authenticateUser = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('server.jwtSecret'));

    
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token, user not found' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error(error); 
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};
