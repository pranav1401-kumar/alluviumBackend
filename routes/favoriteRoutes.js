const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add/:movieId', authMiddleware.authenticateUser, favoriteController.addToFavorites); 
router.delete('/remove/:movieId', authMiddleware.authenticateUser, favoriteController.removeFromFavorites); 

module.exports = router;
