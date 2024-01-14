const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { authenticateUser } = require('../middlewares/authMiddleware');
router.use(authenticateUser);
router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
  
      
      const searchResult = await Movie.find({ title: { $regex: new RegExp(query, 'i') } });
  
      res.json(searchResult);
    } catch (error) {
      console.error('Error searching movies:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  module.exports = router;