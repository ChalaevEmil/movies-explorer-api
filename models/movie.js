const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    required: true,
    type: String,
  },
  director: {
    required: true,
    type: String,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator: (e) => isURL(e),
      message: 'Некорректный формат ссылки',
    },
  },
  trailerLink: {
    required: true,
    type: String,
    validate: {
      validator: (e) => isURL(e),
      message: 'Некорректный формат ссылки',
    },
  },
  thumbnail: {
    required: true,
    type: String,
    validate: {
      validator: (e) => isURL(e),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    required: true,
    type: String,
  },
  nameEN: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
