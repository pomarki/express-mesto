const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const regex = require('./helpers/URL-validate');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
}), createUser);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errors());

app.use((req, res, next) => next(new NotFoundError('Маршрута не существует')));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла таинственная ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
