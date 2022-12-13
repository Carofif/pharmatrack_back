const { error: loggingError } = require('../config/logging');
const { validationResult } = require('express-validator');
const { Arrondissement, Commune } = require('../sequelize/models');
const { Op } = require('sequelize');

const NAMESPACE = 'ARRONDISSEMENT_CONTROLLER';
const Model = Arrondissement;

/**
 * Permet de tester la disponibilité de l'endpoint
 * @param {Request} req
 * @param {Response} res
 */
const ping = (req, res) => {
  try {
    return res.status(200).send('ping');
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

/**
 * Permet de récuperer la liste des arrondissements
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
  const { offset, limit, nom } = req.query;
  try {
    const { count, rows } = await Model.findAndCountAll({
      offset,
      limit,
      where: {
        nom: {
          [Op.iLike]: nom,
        }
      },
    });
    return res.status(200).json({ data: rows, count });
  } catch (error) {
    const message = 'Erreur lors de la récupération des arrondissements';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer un arrondissement
 * @param {Request} req
 * @param {Response} res
 */
const getOne = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const data = await Model.findOne({ where: { id }, include: Commune });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'un arrondissement';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer un arrondissement  avec son nom
 * @param {Request} req
 * @param {Response} res
 */
const getArrondissementByName = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nom } = req.params;
    const data = await Model.findOne({
      where: { nom: {
        [Op.iLike]: nom,
      } },
      include: Commune });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'un arrondissement';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nom, departementId } = req.body;
    const arrondissement = await Model.findOne({ where: { nom, departementId } });
    if (arrondissement) {
      return res.status(400).json({ message: 'Cet arrondissement existe déjà avec ce département.' });
    }
    const data = await Model.create({
      nom: req.body.nom,
      departementId: req.body.departementId,
    });
    return res.status(201).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création d\'un arrondissement';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const deleteOne = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const model = await Model.findOne({ where: { id }, include: [{model: Commune, as: 'communes'}] });
    if (model.communes && Array.isArray(model.communes) && model.communes.length > 0) {
      return res.status(400).send('Cet arrondissement ne peut pas être supprimer car il est lié à des communes');
    }
    else await model.destroy();
    return res.status(200).send('Arrondissement supprimé');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'un arrondissement.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const model = await Model.findByPk(id);
    [
      'nom',
      'departementId',
    ].forEach(key => {
      if (req.body[key]) model[key] = req.body[key];
    });
    const data = await model.save();
    return res.status(200).send({data, msg: 'Modification effectué avec succès'});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'un arrondissement.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

module.exports = {
  ping,
  getAll,
  getOne,
  getArrondissementByName,
  create,
  deleteOne,
  update,
};
