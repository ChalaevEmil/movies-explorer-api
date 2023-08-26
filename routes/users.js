const router = require('express').Router();
const {
  updateUserData,
  getUser,
} = require('../controllers/users');
const {
  updateUserDataValidation,
} = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', updateUserDataValidation, updateUserData);

module.exports = router;
