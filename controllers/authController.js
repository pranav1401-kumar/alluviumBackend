const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');


exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, config.get('server.jwtSecret'), { expiresIn: '1h' });

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, config.get('server.jwtSecret'), { expiresIn: '1h' });
  
      res.json({ token, userId: user._id });
    } catch (error) {
      next(error);
    }
  };

exports.logout = async (req, res, next) => {
  try {
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};
