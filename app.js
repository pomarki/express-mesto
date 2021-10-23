const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  req.user = {
    _id: '610a6acf2d85101364a0b491',
  };

  next();
});

app.use(express.json());

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.get('/', (req, res) => {
  console.log('я запустился!');
  res.send('физкультпривет!');
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send('Запрашиваемый ресурс не найден');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});