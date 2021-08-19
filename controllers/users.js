const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUserById = (req, res) => {
  const ERROR_CODE = 404;
  User.findById(req.params.userId)

    .orFail(new Error("NotValidId"))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.message === "NotValidId") {
        res.status(ERROR_CODE).send({ message: "Пользователя не существует" });
      } else if (error.name === "CastError") {
        res.status(400).send({ message: "Пользователя не существует" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

/* module.exports.createUser = (req, res) => {
  const ERROR_CODE = 400;
  User.create(req.body)
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}; */

module.exports.createUser = (req, res) => {
  const ERROR_CODE = 400;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const ERROR_CODE = 400;
  const { name, about } = req.body;
  console.log(req.user._id);
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .orFail(new Error("NotValidId"))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при обновлении пользователя",
        });
      } else if (error.message === "NotValidId") {
        res.status(404).send({ message: "Пользователя не существует" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const ERROR_CODE = 400;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .orFail(new Error("NotValidId"))
    .then(() => res.send({ avatar }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(ERROR_CODE).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else if (error.message === "NotValidId") {
        res.status(404).send({ message: "Пользователя не существует" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};
