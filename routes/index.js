const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const authRouter = require('./auth');
const auth = require('../middlewares/auth');
const { errorLogger } = require('../middlewares/logger');
const NotFoundError = require('../error/Not-found-error');
const handleError = require('../middlewares/handleError');
// eslint-disable-next-line import/order
const { errors } = require('celebrate');

router.use('', authRouter);
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

router.use(errorLogger);
router.use(errors());
router.use(handleError);

module.exports = router;
