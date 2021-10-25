const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SALT_ROUND, JWT_SECRET } = require('../configs');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email существует');
      }
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
          .send({ _id: user._id, email: user.email }));
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!name || !about) {
    return res.status(400).send({ message: 'Переданы невалидные данные' });
  }

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
    }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
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
    .orFail(new NotFoundError('Переданы некорректные данные'))
    .then(() => res.send({ avatar }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильная почта или пароль'));
      }
      userId = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Неправильная почта или пароль'));
      }
      const token = jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })

    .catch(next);
};

module.exports.getActualUserInfo = (req, res, next) => {
  User.findById(req.user._id)

    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
    }))
    .catch(next);
};
