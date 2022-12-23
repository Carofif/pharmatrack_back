const { isUUID } = require('validator');
const { Arrondissement, Commune } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination  } = require('./general');

const NAMESPACE = 'COMMUNE_VALIDATION';
const Model = Commune;

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
        const data = await Model.findOne({ where: { nom } });
        if (data) return Promise.reject('Cette commune existe déjà');
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
    options: async (value) => {if (!value) return;
      if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
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

const arrondissementIdIfExist = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return;
      if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
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
    nom: nomInBody,
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
    nom: nomInParams,
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination()
  },
};
