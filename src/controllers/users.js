const { Op } = require("sequelize");
const { roles } = require('../config/user');
const { User } = require('../sequelize/models');
const { hashMdp } = require('../services/user');
const { error: loggingError } = require('../config/logging');

const NAMESPACE = 'USER_CONTROLLER';

const create = async (req, res) => {
  try {
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
  const allRoles = [roles.aucun, roles.pharmacien, roles.employe, roles.administrateur];
  if (req.user.role === roles.pharmacien) {
    allRoles.splice(0, 1);
  }
  const { page, limit, nom } = req.query;
  const payoad = {
    attributes: ['id', 'nom', 'prenoms', 'email', 'role', 'sexe', 'telephone'],
    where: {
      role: {
        [Op.or]: allRoles
      },
      nom: { [Op.iLike]: `%${nom || ''}%` },
    },
    order: [['nom', 'ASC']],
  };
  if (limit) payoad.limit = limit;
  if (page) payoad.offset = (page - 1) * (payoad?.limit || 10);
  try {
    const { count, rows } = await User.findAndCountAll(payoad);
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
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
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
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
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
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    let count = 0;
    [
      'nom',
      'prenoms',
      'email',
      'telephone',
      'sexe',
    ].forEach(key => {
      if (req.body[key]) {
        count += 1;
        user[key] = req.body[key];
      }
    });
    let msg = 'Aucun modification effectué';
    if (count > 0) {
      await user.save();
      msg = 'Modification effectué avec succès';
    }
    return res.status(200).send({user, msg});
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la mise à jour d\'un utilisateur', error);
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
  update,
};
