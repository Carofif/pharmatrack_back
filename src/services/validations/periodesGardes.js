const { isUUID } = require('validator');
const { Op } = require('sequelize');
const { PeriodeGarde, Pharmacie } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination } = require('./general');

const NAMESPACE = 'ASSURANCES_VALIDATION';
const Model = PeriodeGarde;

const dateDebutInBody = {
  in: ['body'],
  notEmpty: true,
  trim: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Model.findOne({ where: { [Op.eq] : value } });
        if (data) return Promise.reject('Une période de garde existe déjà avec cette date de début.');
        return value;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};
const dateFinInBody = {
  in: ['body'],
  notEmpty: true,
  trim: true,
  errorMessage: 'Ce champ est obligatoire',
  custom: {
    options: async (value) => {
      try {
        const data = await Model.findOne({ where: { [Op.eq] : value } });
        if (data) return Promise.reject('Une période de garde existe déjà avec cette date de fin.');
        return value;
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
        if (!data) return Promise.reject('Cette pharmacie n\'existe pas');
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
    dateDebut: dateDebutInBody,
    dateFin: dateFinInBody,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    dateDebut: dateDebutInBody,
    dateFin: dateFinInBody,
    pharmacieId,
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination(),
  },
};
