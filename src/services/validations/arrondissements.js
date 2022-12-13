const { Arrondissement, Departements } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId } = require('./general');

const NAMESPACE = 'ARRONDISSEMENT_VALIDATION';
const Model = Arrondissement;

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

const departementId = {
  in: ['body'],
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
const departementIdIfExist = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return;
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
    departementId,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    departementId: departementIdIfExist
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  getArrondissementByName: {
    nom,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
};
