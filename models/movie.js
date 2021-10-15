const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /\/([\w-]{1,32}\.[\w-]{1,32})[^\s]*/gm.test(v);
      },
      message: 'Не правильная ссылка',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/([\w-]{1,32}\.[\w-]{1,32})[^\s]*/gm.test(v);
      },
      message: 'Не правильная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /\/([\w-]{1,32}\.[\w-]{1,32})[^\s]*/gm.test(v);
      },
      message: 'Не правильная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
