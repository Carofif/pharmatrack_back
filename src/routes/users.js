const { Router } = require('express');
const { checkSchema } = require('express-validator');
const controller = require('../controllers/users');
const validation = require('../services/validations/users');

const router = Router();

router.get(
  '/ping',
  controller.ping,
);

router.post(
  '/Create',
  checkSchema(validation.create),
  controller.create,
);

router.get('/GetAll', controller.getAll);

router.get(
  '/GetOne/:userId',
  controller.getOne,
);

router.delete(
  '/DeleteOne/:userId',
  controller.deleteOne,
);

router.put(
  '/Update/:userId',
  checkSchema(validation.create),
  controller.update,
);

module.exports = router;
