const { isUUID } = require('validator');
const { Assurance, Pharmacie } = require('../../sequelize/models');
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
  custom: {
    options: async (value) => {
      if (!value) return value;
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

const pharmacieId = {
  in: ['body'],
  custom: {
    options: async (value) => {
      if (!value) return value;
      if (!isUUID(value, 4)) return Promise.reject('Doit être une UUID');
      try {
        const data = await Pharmacie.findByPk(value);
        if (!data) return Promise.reject('Ce département n\'existe pas');
        return value;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};


module.exports = {
  create: {
    pharmacieId,
    nom: {
      ...nomInBody,
      notEmpty: true,
      trim: true,
      errorMessage: 'Ce champ est obligatoire',
    },
  },
  update: {
    id: validationId(Model, NAMESPACE),
    nom: nomInBody,
    pharmacieId,
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
