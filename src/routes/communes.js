const { Router } = require('express');
const { checkSchema } = require('express-validator');
const controller = require('../controllers/commune');
const schema = require('../services/validations/communes');

const router = Router();

router.get('/ping', controller.ping);
router.get('/', controller.getAll);
router.get('/:id', checkSchema(schema.getOne), controller.getOne);
router.get('/name/:nom', checkSchema(schema.getCommuneByName), controller.getCommuneByName);
router.delete('/:id', checkSchema(schema.deleteOne), controller.deleteOne);
router.post('/', checkSchema(schema.create), controller.create);
router.put('/:id', checkSchema(schema.update), controller.update);

module.exports = router;