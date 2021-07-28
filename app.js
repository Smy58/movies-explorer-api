/* eslint-disable linebreak-style */
const express = require('express');

// const path = require('path');

// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const { errors, celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'http://domainname.students.nomoredomains.monster',
];

app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.status(200).send();
  }

  next();
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(PORT);
});
