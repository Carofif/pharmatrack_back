const { isUUID, isDate } = require('validator');
const { Op } = require('sequelize');
const { PeriodeGarde, Pharmacie } = require('../../sequelize/models');
const { error: loggingError } = require('../../config/logging');
const { validationId, pagination, isRequired } = require('./general');
const moment = require('moment');

const NAMESPACE = 'ASSURANCES_VALIDATION';
const Model = PeriodeGarde;

const periodeValidation = (value) => {
  if (!value || typeof value !== 'object') {
    return { error: 'Le champ "periode" doit être un object avec "dateDebut" et "dateFin"' };
  }
  const { dateDebut, dateFin } = value;
  if (!isDate(dateDebut) || !isDate(dateFin)) {
    return { error: 'Les champs "dateDebut" et "dateFin" doivent être des dates valide au format ISO8601' };
  }
  const fin = moment(dateFin);
  const debut = moment(dateDebut);
  if (fin.diff(debut, 'days') < 1) {
    return { error: 'La date de fin doit être suppérieur à la date de debut d\'au moins 1 jours' };
  }
  return ({ dateDebut, dateFin });
};

const dateDebut = {
  in: ['body'],
  ...isRequired,
  trim: true,
  isDate: {
    errorMessage: 'Le champ "dateDebut" doit être une date',
  },
  isISO8601: {
    errorMessage: 'Le champ "dateDebut" doit être une date au format ISO8601',
    options: { strict: true, strictSeparator: true },
  },
};
const dateFin = {
  in: ['body'],
  ...isRequired,
  trim: true,
  isDate: {
    errorMessage: 'Le champ "dateFin" doit être une date',
  },
  isISO8601: {
    errorMessage: 'Le champ "dateFin" doit être une date au format ISO8601',
    options: { strict: true, strictSeparator: true },
  },
};

const periode = {
  in: ['body'],
  ...isRequired,
  errorMessage: 'Le champ "periode" doit être un object avec "dateDebut" et "dateFin"',
  custom: {
    options: async (value) => {
      const { dateDebut, dateFin, error } = periodeValidation(value);
      if (error) return Promise.reject(error);
      try {
        const data = await Model.findOne({ where: {
          dateDebut: { [Op.eq]: dateDebut },
          dateFin: { [Op.eq]: dateFin },
        }});
        if (data) return Promise.reject('Cette période de garde existe déjà');
        return value;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};

const periodes = {
  in: ['body'],
  ...isRequired,
  errorMessage: 'Le champ "periode" doit être un tableau d\'object avec "dateDebut" et "dateFin"',
  custom: {
    options: async (value) => {
      if (!value || !Array.isArray(value)) return Promise.reject('Le champ "periode" doit être un tableau d\'object avec "dateDebut" et "dateFin"');
      const periodesGarde = value.map(p => {
        const { dateDebut, dateFin, error } = periodeValidation(p);
        if (error) return null;
        return { dateDebut, dateFin, debutFin: `${dateDebut}_${dateFin}` };
      });
      if (periodesGarde.includes(null)) return Promise.reject('Il y a des periodes invalide dans la liste');
      const doublons = periodesGarde.reduce((acc, val) => {
        const debutFin = `${val.dateDebut}_${val.dateFin}`;
        if (periodesGarde.filter(p => p.debutFin === debutFin).length > 1) acc.push(debutFin);
        return acc;
      }, []);
      if (doublons.length) return Promise.reject('Il y a des periodes en doublon dans la liste');
      try {
        const { count } = await Model.findAndCountAll({ where: { [Op.or]: periodesGarde.map(p => ({
          dateDebut: { [Op.eq]: p.dateDebut },
          dateFin: { [Op.eq]: p.dateFin },
        }))}});
        if (count > 0) return Promise.reject('Certaine periodes de la liste existe déjà');
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
    'periode.dateDebut': dateDebut,
    'periode.dateFin': dateFin,
    periode,
    pharmacieId,
  },
  update: {
    id: validationId(Model, NAMESPACE),
    'periode.dateDebut': dateDebut,
    'periode.dateFin': dateFin,
    periode: {
      ...periode,
      optional: true,
    },
    pharmacieId: {
      ...pharmacieId,
      optional: true,
    },
  },
  getOne: {
    id: validationId(Model, NAMESPACE),
  },
  deleteOne: {
    id: validationId(Model, NAMESPACE),
  },
  getAll: {
    ...pagination(),
    dateDebut: {
      ...dateDebut,
      in: ['query'],
      optional: true,
    },
    dateFin: {
      ...dateFin,
      in: ['query'],
      optional: true,
    },
  },
  createAll: {
    'periodes.*.dateDebut': dateDebut,
    'periodes.*.dateFin': dateFin,
    periodes,
  },
  createAllForPharmacie: {
    'periodes.*.dateDebut': dateDebut,
    'periodes.*.dateFin': dateFin,
    periodes,
    pharmacieId: {
      ...pharmacieId,
      ...isRequired,
      in: ['params'],
    },
  },
};
