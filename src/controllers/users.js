const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const configUser = require('../config/user');
const { User } = require('../sequelize/models');
const { hashMdp } = require('../services/user');
const { error: loggingError } = require('../config/logging');

const NAMESPACE = 'USER_CONTROLLER';

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {email} = req.body.email;
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé pour un utilisateur' });
    }
    await User.create({
      nom: req.body.nom,
      prenoms: req.body.prenoms,
      sexe: req.body.sexe,
      telephone: req.body.telephone,
      email: req.body.email,
      motDePasse: hashMdp(req.body.mdp),
      role: req.body.role,
    });
    return res.status(201).send('Utilisateur crée');
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la création d\'un utilisateur', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const getAll = async (req, res) => {
  const { offset, limit } = req.query;
  const roles = [configUser.roles.aucun, configUser.roles.pharmacien, configUser.roles.employe, configUser.roles.administrateur];
  if (req.user.role === configUser.roles.pharmacien) {
    roles.splice(0, 1);
  }
  try {
    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'nom', 'prenoms', 'email', 'role', 'sexe', 'telephone'],
      offset,
      limit,
      where: {
        role: {
          [Op.or]: roles
        },
      }
    });
    return res.status(200).json({
      data: rows,
      count
    });
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la récupération des utilisateur', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    delete user.dataValues.mdp;
    return res.status(200).json(user);
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la récupération d\'un utilisateurs', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const deleteOne = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    await user.destroy();
    return res.status(200).send('Utilisateur supprimé');
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la suppression d\'un utilisateur', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    user.nom = req.body.nom;
    user.prenoms = req.body.prenoms;
    user.email = req.body.email;
    user.telephone = req.body.telephone,
    user.sexe = req.body.sexe,
    await user.save();
    return res.status(200).send('Modification effectué avec succès');
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la mise à jour d\'un utilisateur', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const ping = (req, res) => {
  try {
    return res.status(200).send('ping');
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  deleteOne,
  ping,
  update,
};
