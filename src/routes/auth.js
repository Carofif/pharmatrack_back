const express = require('express');
const { checkSchema } = require('express-validator');
const controller = require('../controllers/auth');
const validation = require('../services/validations/validation-auth');
const {
  validationToken,
} = require('../midelware/auth');

const router = express.Router();

router.post(
  '/',
  checkSchema(validation.login),
  controller.login,
);
router.get(
  '/check-token',
  validationToken,
  controller.checkToken,
);
router.put(
  '/change-mdp/:userId',
  validationToken,
  checkSchema(validation.changeMdp),
  controller.changeMdp,
);

module.exports = router;