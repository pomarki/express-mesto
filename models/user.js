const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "Жак-Ив Кусто",
      minLength: 2,
      maxLength: 30,
    },
    about: {
      type: String,
      required: false,
      default: "Исследователь",
      minLength: 2,
      maxLength: 30,
    },
    avatar: {
      type: String,
      required: false,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
