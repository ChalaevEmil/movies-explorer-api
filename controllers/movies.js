const Movie = require('../models/movie');
const NotFoundError = require('../error/Not-found-error');
const ForbiddenError = require('../error/Forbidden-error');
const BadRequestError = require('../error/Bad-request-error');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const savedMovies = movies.filter(
        (movie) => movie.owner.toHexString() === req.user._id,
      );
      res.send(savedMovies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const newMovie = req.body;
  // eslint-disable-next-line no-unused-vars
  newMovie.owner = req.user._id;
  Movie.create(newMovie)
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Переданы некорректные данные при создании видео'),
        );
      } else {
        next(err);
      }
    });
};

const removeMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Видеофайл с указанным _id не найден');
      } else if (movie.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить этот видеофайл');
      } else {
        Movie.findByIdAndRemove(movieId)
          .then(() => res.status(200).send({
            message: 'Видеофайл удален',
          }))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, createMovie, removeMovie };
