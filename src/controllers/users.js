const { Op } = require("sequelize");
const { roles } = require('../config/user');
const { Utilisateur } = require('../sequelize/models');
const { hashMdp } = require('../services/user');
const { error: loggingError } = require('../config/logging');

const NAMESPACE = 'USER_CONTROLLER';

const create = async (req, res) => {
  try {
    await Utilisateur.create({
      nom: req.body?.nom || null,
      prenoms: req.body?.prenoms || null,
      sexe: req.body?.sexe || null,
      telephone: req.body?.telephone || null,
      email: req.body.email,
      motDePasse: hashMdp(req.body.motDePasse),
      role: req.body.role,
      pharmacieId: req.body?.pharmacieId || null,
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
    const { count, rows } = await Utilisateur.findAndCountAll(payoad);
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

const getOne = (req, res) => {
  // const { userId } = req.params;
  const { model } = req;
  try {
    // const user = await Utilisateur.findByPk(userId);
    delete model.dataValues.motDePasse;
    return res.status(200).json(model);
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la récupération d\'un utilisateurs', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const deleteOne = async (req, res) => {
  // const { userId } = req.params;
  const { model } = req;
  try {
    // const user = await Utilisateur.findByPk(userId);
    await model.destroy();
    return res.status(200).send('Utilisateur supprimé');
  } catch (error) {
    loggingError(NAMESPACE, 'Erreur lors de la suppression d\'un utilisateur', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  // const { userId } = req.params;
  const { model } = req;
  try {
    // const model = await Utilisateur.findByPk(userId);
    let count = 0;
    [
      'nom',
      'prenoms',
      'sexe',
      'telephone',
      'email',
      'role',
      'pharmacieId',
    ].forEach(key => {
      if (req.body[key]) {
        count += 1;
        model[key] = req.body[key];
      }
    });
    let msg = 'Aucun modification effectué';
    if (count > 0) {
      await model.save();
      msg = 'Modification effectué avec succès';
    }
    delete model.dataValues.motDePasse;
    return res.status(200).send({data: model, msg});
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
