const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../helpers/URL-validate');

const {
  getUsers, getUserById, updateUserProfile, updateAvatar, getActualUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getActualUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().min(16),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regex),
  }),
}), updateAvatar);

module.exports = router;
