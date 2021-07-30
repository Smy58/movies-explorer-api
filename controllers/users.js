const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
require('dotenv').config();

const NotFoundError = require('../errors/not-found-err'); // 404
const BadRequestError = require('../errors/bad-request-err'); // 400
const ServerError = require('../errors/server-err'); // 500
const ConflictError = require('../errors/conflict-err'); // 409

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.find({ email })
    .then((user) => {
      if (user[0] === undefined) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, email, password: hash,
          })
            .then((newUser) => res.send({ data: newUser })));
      } else {
        throw new ConflictError('Пользователь с таким email уже существует.');
      }
    })
    .catch((err) => {
      if (err.statusCode === 409) {
        next(err);
      }
      if (err.name === 'ValidationError') {
        const e = new BadRequestError('Переданы некорректные данные при создании пользователя.');
        next(e);
      }
      const e = new ServerError('Ошибка по умолчанию.');
      next(e);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name: newName, email: newEmail } = req.body;
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        const name = newName || user.name;
        const email = newEmail || user.email;
        User.findByIdAndUpdate(req.user._id, { name, email },
          {
            new: true,
            runValidators: true,
          })
          .then((userUpd) => {
            if (userUpd === null) {
              throw new NotFoundError('Пользователь по указанному _id не найден.');
            } else {
              res.send({ data: user });
            }
          });
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      }
      if (err.name === 'ValidationError') {
        const e = new BadRequestError('Переданы некорректные данные при обновлении профиля.');
        next(e);
      }
      if (err.name === 'Not Found') {
        const e = new NotFoundError('Пользователь с указанным _id не найден.');
        next(e);
      }
      if (err.name === 'CastError') {
        const e = new BadRequestError('Переданы некорректные данные при обновлении профиля.');
        next(e);
      }
      const e = new ServerError('Ошибка по умолчанию.');
      next(e);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });

      return res.send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(err);
      }
      const e = new ServerError('Ошибка по умолчанию.');
      next(e);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (err.name === 'CastError') {
        const e = new BadRequestError('Передан некорректный токен пользователя.');
        next(e);
      }
      const e = new ServerError('Ошибка по умолчанию.');
      next(e);
    });
};
