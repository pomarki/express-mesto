const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    about: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    avatar: {
      type: String,
      required: true,
      default: 'http://www.ссылка на случайную картинку.ru',
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
