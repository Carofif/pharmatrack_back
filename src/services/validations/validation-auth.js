const { mdpValidation, compareMdp } = require('../user');
const { User } = require('../../sequelize/models');

const email = {
  in: ['body'],
  isEmail: true,
  errorMessage: 'Email invalide'
};
const mdpLogin = {
  in: ['body'],
  custom: {
    options: (value, { req }) => {
      return User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          if (!compareMdp(value, user.mdp)) return Promise.reject('Mot de passe incorrect');
          return Promise.resolve();
        }
        return Promise.reject('Cet utilisateur n\'existe pas');
      });
    }
  },
};
const mdpNouveau = {
  in: ['body'],
  custom: {
    options: (value) => {
      if (!mdpValidation(value)) throw new Error('Le mot de passe doit avoir au moins 6 caractères');
      return true;
    }
  },
};
const mdpNouveauConfirm = {
  in: ['body'],
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.mdpNouveau) throw new Error('La confirmation doit être identique au nouveau mot de passe');
      return true;
    }
  },
};

module.exports = {
  login: {
    email,
    mdp: mdpLogin,
  },
  changeMdp: {
    mdpNouveau,
    mdpNouveauConfirm
  },
};
