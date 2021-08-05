const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("user")
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Error all cards" }));
};

module.exports.createCard = (req, res) => {
  const ERROR_CODE = 400;
  const owner = req.user._id;
  const { name, link, likes } = req.body;
  Card.create({ name, link, owner: owner, likes })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании карточки",
        });
        return;
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const ERROR_CODE = 404;

  Card.findByIdAndRemove(req.params.cardId)

    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({ message: "Карточки с этим id не существует" });
        return;
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const ERROR_CODE = 400;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({ message: "Переданы некорректные данные для постановки лайка." });
        return;
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });;
};

module.exports.dislikeCard = (req, res) => {
  const ERROR_CODE = 400;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(ERROR_CODE)
          .send({ message: "Переданы некорректные данные для снятии лайка." });
        return;
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};
