const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  const ERROR_CODE = 404;
  User.findById(req.params.userId)

    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.message === 'NotValidId') {
        res.status(ERROR_CODE).send({ message: 'Пользователя не существует' });
      } else if (error.name === 'CastError') {
        res.status(400).send({ message: 'Пользователя не существует' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
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
};

module.exports.updateUserProfile = (req, res) => {
  const ERROR_CODE = 400;
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении пользователя',
        });
      } else if (error.message === 'NotValidId') {
        res.status(404).send({ message: `Пользователя не существует: ${userId}` });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
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
    },
  )
    .orFail(new Error('NotValidId'))
    .then(() => res.send({ avatar }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else if (error.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователя не существует' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};