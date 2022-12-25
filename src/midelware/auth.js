const jwt = require('jsonwebtoken');
const { server } = require('../config');
const { roles } = require('../config/user');
const { Utilisateur } = require('../sequelize/models');

const validationToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({
      status: 'unauthorized',
      messages: ['Token non fourni'],
      name: 'NoToken',
    });
  }
  const [, token] = authorization.split('Bearer ');
  if (!token) {
    return res.status(401).send({
      status: 'unauthorized',
      messages: ['Token non fourni'],
      name: 'NoToken',
    });
  }
  try {
    const decoded = jwt.verify(token, server.secretToken);
    const user = await Utilisateur.findByPk(decoded.id);
    if (!user) {
      return res.status(401).send({
        status: 'unauthorized',
        messages: ['Aucun utilisateur trouvé'],
        name: 'NoUserWithToken',
      });
    }
    if (req.forUser) {
      if (req.params.userId !== decoded.id) {
        if (!req.roles.includes(user.role)) {
          return res.status(401).send({
            status: 'unauthorized',
            messages: ['Vous n\'êtes pas autorisé à faire cette action'],
            name: 'UnauthorizedAction',
          });
        }
      }
    }
    else if (!req.roles.includes(user.role)) {
      return res.status(401).send({
        status: 'unauthorized',
        messages: ['Vous n\'êtes pas autorisé à faire cette action'],
        name: 'UnauthorizedAction',
      });
    }
    req.user = {
      id: user.id,
      nom: user.nom,
      prenoms: user.prenoms,
      sexe: user.sexe,
      telephone: user.telephone,
      email: user.email,
      role: user.role,
      tokenExtern: decoded.tokenExtern
    };
    next();
    return true;
  } catch (error) {
    return res.status(401).send({
      status: 'error',
      messages: ['Le token est expiré. Veuillez faire une demande mot de passe oublié'],
      name: error.name,
    });
  }
};

const adminRole = (req, res, next) => {
  if (!Array.isArray(req.roles)) req.roles = [roles.administrateur];
  else req.roles.push(roles.administrateur);
  next();
};

const employeRole = (req, res, next) => {
  if (!Array.isArray(req.roles)) req.roles = [roles.employe];
  else req.roles.push(roles.employe);
  next();
};

const pharmacienRole = (req, res, next) => {
  if (!Array.isArray(req.roles)) req.roles = [roles.pharmacien];
  else req.roles.push(roles.pharmacien);
  next();
};

const aucunRole = (req, res, next) => {
  if (!Array.isArray(req.roles)) req.roles = [roles.aucun];
  else req.roles.push(roles.aucun);
  next();
};

const allRole = (req, res, next) => {
  req.roles = Object.values(roles);
  next();
};

const forUser = (req, res, next) => {
  req.forUser = true;
  next();
};

module.exports = {
  validationToken,
  adminRole,
  employeRole,
  pharmacienRole,
  aucunRole,
  allRole,
  forUser,
};
