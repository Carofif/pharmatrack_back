const { Departements } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId } = require('./general');

const NAMESPACE = 'DEPARTEMENTS_VALIDATION';
const Model = Departements;

const nom = {
  in: ['params', 'body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Departements.findByPk(value);
        if (!data) {
          return Promise.reject('Ce département n\'existe pas');
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
  getDepartementByName: {
    nom,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
};
