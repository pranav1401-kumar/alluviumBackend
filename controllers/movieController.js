const Movie = require('../models/Movie');
const mongoose = require('mongoose');
const User = require('../models/User');

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieDetails = async (req, res, next) => {
    try {
      const movieId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ message: 'Invalid movie ID' });
      }
  
      const movie = await Movie.findById(movieId);
  
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      res.json(movie);
    } catch (error) {
      next(error);
    }
}

exports.getRecommendations = async (req, res, next) => {
    try {
      const user = req.user; 
      const userFavoriteGenres = user.favoriteGenres; 
  
      
      const recommendedMovies = await Movie.find({ genres: { $in: userFavoriteGenres } })
        .limit(5)
        .select('-description'); 
      res.json(recommendedMovies);
    } catch (error) {
      next(error);
    }
};


exports.addToFavorites = async (req, res, next) => {
    try {
        const userId = req.body.userId;  
        const movieId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Received userId:', userId);

        user.favoriteMovies = user.favoriteMovies || [];

        if (user.favoriteMovies.includes(movieId)) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }

        
        user.favoriteMovies.push(movieId);
        await user.save();

        res.json({ message: 'Movie added to favorites successfully' });
    } catch (error) {
        next(error);
    }
};


exports.rateMovie = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const movieId = req.params.id;
        const { rating } = req.body;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }

        
        console.log('Received userId for rating:', userId);

        
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        
        const user = await User.findById(userId);

       
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        const existingRatingIndex = user.ratedMovies ? user.ratedMovies.findIndex((item) => item.movieId === movieId) : -1;

        if (existingRatingIndex !== -1) {
           
            user.ratedMovies[existingRatingIndex].rating = rating;
        } else {
           
            user.ratedMovies = user.ratedMovies || [];
            user.ratedMovies.push({ movieId, rating });
        }

        await user.save();

        res.json({ message: 'Movie rated successfully' });
    } catch (error) {
        next(error);
    }
};
