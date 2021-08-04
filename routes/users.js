const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe, updateUser, getNothing,
} = require('../controllers/users');

router.get('/users/me', getUserMe);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);

router.get('/*', getNothing);
router.post('/*', getNothing);

module.exports = router;
