const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link, likes } = req.body;
  if (!name || !link) {
    return res.status(400).send({ message: 'Переданы некорректные данные для создания карточки' });
  }
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new BadRequestError('Переданы некорректные данные для постановки лайка'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new BadRequestError('Переданы некорректные данные для постановки лайка'))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new BadRequestError('Переданы некорректные данные для постановки лайка'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne({ _id: card._id })
          .then(res.send({ message: 'Карточка удалена' }));
      }
      throw new ForbiddenError('Нельзя удалять карточки других пользователей');
    })
    .catch(next);
};
