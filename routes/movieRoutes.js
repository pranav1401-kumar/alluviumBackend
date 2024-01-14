const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/getmovie', movieController.getMovies);
router.get('/:id', movieController.getMovieDetails);
router.post('/recommendations', authMiddleware.authenticateUser, movieController.getRecommendations); 
router.post('/:id/favorite', movieController.addToFavorites);
router.post('/:id/rate', movieController.rateMovie);
module.exports = router;
