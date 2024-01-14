
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.use(authenticateUser);

router.get('/favorite', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
