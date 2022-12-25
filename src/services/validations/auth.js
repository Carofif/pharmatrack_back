const { mdpValidation, compareMdp } = require('../user');
const { error: loggingError } = require('../../config/logging');
const { Utilisateur } = require('../../sequelize/models');
const { validationId } = require('./general');

const NAMESPACE = 'AUTH_VALIDATION';
const Model = Utilisateur;

const email = {
  in: ['body'],
  isEmail: true,
  trim: true,
  errorMessage: 'Email invalide',
};
const mdpLogin = {
  in: ['body'],
  custom: {
    options: async (value, { req }) => {
      try {
        const data = await Model.findOne({ where: { email: req.body.email } });
        if (!data) return Promise.reject('Cet utilisateur n\'existe pas');
        if (!compareMdp(value, data.motDePasse))  return Promise.reject('Mot de passe incorrect');
        req.model = data;
        return value;
      } catch (e) {
        loggingError(NAMESPACE, e.message, e);
      }
    }
  },
};
const mdpNouveau = {
  in: ['body'],
  if: {
    options: value => mdpValidation(value),
    errorMessage: 'Le mot de passe doit avoir au moins 6 caractères',
  },
};
const mdpNouveauConfirm = {
  in: ['body'],
  if: {
    options: (value, { req }) => value === req.body.mdpNouveau,
    errorMessage: 'La confirmation doit être identique au nouveau mot de passe',
  },
};

module.exports = {
  login: {
    email,
    mdp: mdpLogin,
  },
  changeMdp: {
    mdpNouveau,
    mdpNouveauConfirm,
    userId: validationId(Model, NAMESPACE),
  },
};
