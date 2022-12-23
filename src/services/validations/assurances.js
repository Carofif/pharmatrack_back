const { Assurance } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination } = require('./general');

const NAMESPACE = 'ASSURANCES_VALIDATION';
const Model = Assurance;

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
        const data = await Assurance.findOne({ where: { nom } });
        if (data) return Promise.reject('Cette assurance existe déjà.');
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
  getByName: {
    nom: nomInParams,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination()
  },
};
