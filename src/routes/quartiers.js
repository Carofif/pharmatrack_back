const { Router } = require('express');
const { checkSchema } = require('express-validator');
const controller = require('../controllers/quartier');
const schema = require('../services/validations/quartiers');

const router = Router();

router.get('/ping', controller.ping);
router.get('/', checkSchema(schema.getAll), controller.getAll);
router.get('/:id', checkSchema(schema.getOne), controller.getOne);
router.get('/name/:nom', checkSchema(schema.getQuartierByName), controller.getQuartierByName);
router.delete('/:id', checkSchema(schema.deleteOne), controller.deleteOne);
router.post('/', checkSchema(schema.create), controller.create);
router.put('/:id', checkSchema(schema.update), controller.update);

module.exports = router;