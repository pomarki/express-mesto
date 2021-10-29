const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = require('../helpers/URL-validate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(regex),
  }),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

router.delete('/:cardId', celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard);

module.exports = router;
