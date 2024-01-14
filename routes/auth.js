

const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
 
    const decoded = jwt.verify(refreshToken, config.get('server.refreshTokenSecret'));

    
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Refresh token has expired' });
    }

    
    const newAccessToken = jwt.sign({ userId: decoded.userId }, config.get('server.jwtSecret'), {
      expiresIn: config.get('server.accessTokenExpiry'),
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;
