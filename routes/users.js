const router = require('express').Router();

const {
  getUsers, getUserById, updateUserProfile, updateAvatar, getActualUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getActualUserInfo);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
