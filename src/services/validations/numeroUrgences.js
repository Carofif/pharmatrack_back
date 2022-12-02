const { NumeroUrgence } = require('../../sequelize/models');
// const { error: loggingError } = require('../../config/logging');
const { validationId } = require('./general');

const NAMESPACE = 'NUMERO_URGENCE_VALIDATION';
const Model = NumeroUrgence;

const nom = {
  in: ['body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire'
};
const telephone = {
  in: ['body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire'
};



module.exports = {
  create: {
    nom,
    telephone,
  },
  update: {
    id: validationId(Model, NAMESPACE),
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
};
