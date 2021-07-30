const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err'); // 404
const BadRequestError = require('../errors/bad-request-err'); // 400
const ServerError = require('../errors/server-err'); // 500
const ForbiddenError = require('../errors/forbidden-err'); // 403

module.exports.getNothing = (req, res, next) => {
  const e = new NotFoundError('Запрашиваемый ресурс не найден.');
  next(e);
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(req.user._id)
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        const e = new BadRequestError('Переданы некорректные данные при создании карточки.');
        next(e);
      }
      const e = new ServerError('Ошибка по умолчанию.');
      next(e);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    nameRU,
    nameEN,
    image,
    trailer,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    nameRU,
    nameEN,
    image,
    trailer,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new BadRequestError('Переданы некорректные данные при создании карточки.');
        next(e);
      }
      const e = new ServerError('Ошибка по умолчанию.');
      next(e);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((user) => {
      if (user === null) {
        const e = new NotFoundError('Карточка с указанным _id не найдена.');
        next(e);
      } else if (`${user.owner}` !== req.user._id) {
        const e = new ForbiddenError('Удаление чужой карточки.');
        next(e);
      } else {
        Movie.findByIdAndDelete(req.params.movieId)
          .then((movie) => {
            res.send({ data: movie });
          });
      }
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === 'CastError') {
        const e = new BadRequestError('Переданы некорректные данные карточки.');
        next(e);
      }
      if (err.name === 'Not Found') {
        const e = new NotFoundError('Карточка с указанным _id не найдена.');
        next(e);
      }
      const e = new ServerError('Ошибка по умолчанию.');
      next(e);
    });
};
