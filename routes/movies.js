const router = require('express').Router();
const {
  getMovies, createMovie, removeMovie,
} = require('../controllers/movies');
const {
  createMovieValidation,
  movieIdValidation,
} = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', movieIdValidation, removeMovie);

module.exports = router;
