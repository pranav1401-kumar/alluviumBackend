const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movieRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const favorite = require('./routes/favorite');
const search = require('./routes/serach');
const auth = require('./routes/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(config.get('database.url'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favor', favorite);
app.use('/api/movies',search );
app.use('/api',auth);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || config.get('server.port');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
