const router = require('express').Router();
const { createNewUser, login, logout } = require('../controllers/users');
const {
  createNewUserValidation,
  loginValidation,
} = require('../middlewares/validation');

router.post('/signup', createNewUserValidation, createNewUser);
router.post('/signin', loginValidation, login);
router.post('/signout', logout);

module.exports = router;
