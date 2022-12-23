const { Departements } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination } = require('./general');

const NAMESPACE = 'DEPARTEMENTS_VALIDATION';
const Model = Departements;

const nomInParams = {
  in: ['params'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
};
const nomInBody = {
  in: ['body'],
  notEmpty: true,
  trim: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      const nom = value || '';
      try {
        const data = await Departements.findOne({ where: { nom } });
        if (data) return Promise.reject('Ce département existe déjà.');
        return nom;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

module.exports = {
  create: {
    nom: nomInBody,
  },
  update: {
    id: validationId(Model, NAMESPACE),
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  getDepartementByName: {
    nom: nomInParams,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination
  },
};
