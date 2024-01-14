const express = require('express');
const User = require('../models/User');
const Movie = require('../models/Movie');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');

router.use(authenticateUser);

exports.addToFavorites = async (req, res, next) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Invalid user information' });
      }
  
      const userId = req.user._id;
      const { movieId } = req.params;
  
      console.log('User ID:', userId);
      console.log('Movie ID:', movieId);
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      if (!user.favorites.includes(movieId)) {
        user.favorites.push(movieId);
        await user.save();
        res.json({ message: 'Movie added to favorites' });
      } else {
        res.json({ message: 'Movie is already in favorites' });
      }
    } catch (error) {
      next(error);
    }
  };
  

exports.removeFromFavorites = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      user.favorites = user.favorites
        .filter((fav) => fav && fav.toString() !== movieId);
  
      await user.save();
  
      res.json({ message: 'Movie removed from favorites' });
    } catch (error) {
      next(error);
    }
  };
  
