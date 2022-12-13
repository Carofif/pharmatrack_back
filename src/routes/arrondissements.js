const { Router } = require('express');
const { checkSchema } = require('express-validator');
const controller = require('../controllers/arrondissement');
const schema = require('../services/validations/arrondissements');

const router = Router();

router.get('/ping', controller.ping);
router.get('/', controller.getAll);
router.get('/:id', checkSchema(schema.getOne), controller.getOne);
router.get('/name/:nom', checkSchema(schema.getArrondissementByName), controller.getArrondissementByName);
router.delete('/:id', checkSchema(schema.deleteOne), controller.deleteOne);
router.post('/', checkSchema(schema.create), controller.create);
router.put('/:id', checkSchema(schema.update), controller.update);

module.exports = router;