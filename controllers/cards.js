const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Error all cards' }));
};

module.exports.createCard = (req, res) => {
  const ERROR_CODE = 400;
  const owner = req.user._id;
  const { name, link, likes } = req.body;
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const ERROR_CODE = 400;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const ERROR_CODE = 400;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятии лайка.' });
      } else if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne({ _id: card._id })
          .then(res.send({ message: 'Карточка удалена' }));
      }
      return res.status(403).send({ message: 'Запрещено удалять карточки чужих пользователей' });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};
