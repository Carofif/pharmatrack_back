const { Assurance } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId } = require('./general');

const NAMESPACE = 'ASSURANCES_VALIDATION';
const Model = Assurance;

const nom = {
  in: ['params', 'body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Assurance.findByPk(value);
        if (!data) {
          return Promise.reject('Cette assurance n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};



module.exports = {
  create: {
    nom,
  },
  update: {
    id: validationId(Model, NAMESPACE),
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  getByName: {
    nom,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
};
