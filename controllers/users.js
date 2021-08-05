const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUserById = (req, res) => {
  const ERROR_CODE = 404;
  User.findById(req.params.id)

    .orFail(new Error("NotValidId"))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      error.message === "NotValidId"
        ? res.status(ERROR_CODE).send({ message: "Пользователя не существует" })
        : res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports.createUser = (req, res) => {
  const ERROR_CODE = 400;
  User.create(req.body)
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при создании пользователя",
          });
        return;
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
      upsert: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при обновлении пользователя",
          });
        return;
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
    { avatar: avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((data) => res.send({ avatar: avatar }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(ERROR_CODE)
          .send({
            message: "Переданы некорректные данные при обновлении аватара",
          });
        return;
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};
