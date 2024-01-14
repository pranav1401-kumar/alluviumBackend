

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const User = require('../models/User');


router.use(authenticateUser);


router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); 
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
