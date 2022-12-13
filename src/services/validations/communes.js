const { Arrondissement, Commune } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId } = require('./general');

const NAMESPACE = 'COMMUNE_VALIDATION';
const Model = Commune;

const nom = {
  in: ['params', 'body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Commune.findByPk(value);
        if (!data) {
          return Promise.reject('Cette commune n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const arrondissementId = {
  in: ['body'],
  notEmpty: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Arrondissement.findByPk(value);
        if (!data) {
          return Promise.reject('Ce arrondissement n\'existe pas');
        }
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};
const arrondissementIdIfExist = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return;
      try {
        const data = await Arrondissement.findByPk(value);
        if (!data) {
          return Promise.reject('Cet arrondissement n\'existe pas');
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
    arrondissementId,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    arrondissementId: arrondissementIdIfExist
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  getCommuneByName: {
    nom,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
};
