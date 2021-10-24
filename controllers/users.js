const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SALT_ROUND, JWT_SECRET } = require('../configs');

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

  bcrypt
    .hash(req.body.password, SALT_ROUND)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res
      .status(201)
      .send({ _id: user._id, email: user.email }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  let userId;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      userId = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      const token = jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })

    .catch((error) => {
      res.status(401).send({ message: error.message });
    });
};

module.exports.getActualUserInfo = (req, res) => {
  const ERROR_CODE = 404;
  User.findById(req.user._id)

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
