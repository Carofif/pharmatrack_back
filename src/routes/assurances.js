const { Router } = require('express');
const { checkSchema } = require('express-validator');
const controller = require('../controllers/assurances');
const schema = require('../services/validations/assurances');

const router = Router();

router.get('/ping', controller.ping);
router.get('/', controller.getAll);
router.get('/:id', checkSchema(schema.getOne), controller.getOne);
router.get('/name/:nom', checkSchema(schema.getByName), controller.getByName);
router.delete('/:id', checkSchema(schema.deleteOne), controller.deleteOne);
router.post('/', checkSchema(schema.create), controller.create);
router.put('/:id', checkSchema(schema.update), controller.update);

module.exports = router;