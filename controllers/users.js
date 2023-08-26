const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequestError = require('../error/Bad-request-error');
const NotFoundError = require('../error/Not-found-error');
const ConflictError = require('../error/Conflict-error');
const UnauthorizedError = require('../error/Unauthorized-error');

const createNewUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    // eslint-disable-next-line no-shadow
    .then(({ name, email }) => res.status(201).send({ name, email }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь с указанными данными не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUserData = (req, res, next) => {
  const newData = req.body;
  User.findByIdAndUpdate(req.user._id, newData, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь с указанными данными не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 36000000,
        httpOnly: true,
        sameSite: true,
      });
      res.send(user);
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

const logout = (req, res) => res.clearCookie('jwt').status(200).send({ message: 'Выход' });

module.exports = {
  createNewUser,
  updateUserData,
  login,
  getUser,
  logout,
};
