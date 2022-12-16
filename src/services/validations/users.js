const { roles } = require('../../config/user');

const email = {
  in: ['body'],
  isEmail: true,
  errorMessage: 'Email invalide'
};

const role = {
  in: ['body'],
  isIn: [roles.aucun, roles.pharmacien, roles.employe],
  errorMessage: 'La valeur du champ role est inconrect'
};

module.exports = {
  create: {
    email,
    role,
  },
};
