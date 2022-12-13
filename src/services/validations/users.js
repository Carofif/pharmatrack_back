const { roles } = require('../../config/user');

const email = {
  in: ['body'],
  isEmail: true,
  errorMessage: 'Email invalide'
};

const role = {
  in: ['body'],
  custom: {
    options: (value) => {
      if (!value || ![roles.aucun, roles.pharmacien, roles.employe].includes(value)) {
        throw new Error('La valeur du champ role est inconrect');
      }
      return true;
    }
  },
};

module.exports = {
  create: {
    email,
    role,
  },
};
