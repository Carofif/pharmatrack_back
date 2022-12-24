const { Router } = require('express');
const { checkSchema } = require('express-validator');
const controller = require('../controllers/arrondissement');
const schema = require('../services/validations/arrondissements');

const router = Router();

router.get('/ping', controller.ping);
router.get('/', checkSchema(schema.getAll), controller.getAll);
router.get('/:id', checkSchema(schema.getOne), controller.getOne);
router.get('/name/:nom', checkSchema(schema.getByName), controller.getByName);
router.delete('/:id', checkSchema(schema.deleteOne), controller.deleteOne);
router.post('/', checkSchema(schema.create), controller.create);
router.put('/:id', checkSchema(schema.update), controller.update);

module.exports = router;