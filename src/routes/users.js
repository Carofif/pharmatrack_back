const { Router } = require('express');
// const { checkSchema } = require('express-validator');
const controller = require('../controllers/users');
// const schema = require('../services/validations/categories');

const router = Router();

router.get('/ping', controller.ping);
router.get('/', controller.getAll);

module.exports = router;