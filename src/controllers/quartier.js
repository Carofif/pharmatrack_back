const { error: loggingError } = require('../config/logging');
const { validationResult } = require('express-validator');
const { Quartier } = require('../sequelize/models');
const { Op } = require('sequelize');

const NAMESPACE = 'COMMUNE_CONTROLLER';
const Model = Quartier;

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
 * Permet de récuperer la liste des quartiers
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
    const message = 'Erreur lors de la récupération des quartiers';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer un quartier
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
    const data = await Model.findOne({ where: { id } });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'un quartier';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer un quartier  avec son nom
 * @param {Request} req
 * @param {Response} res
 */
const getQuartierByName = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nom } = req.params;
    const data = await Model.findOne({
      where: { nom: {
        [Op.iLike]: nom,
      } } });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'un quartier';
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
    const { nom, communeId } = req.body;
    const commune = await Model.findOne({ where: { nom, communeId } });
    if (commune) {
      return res.status(400).json({ message: 'Cet quartier existe déjà avec cette commune.' });
    }
    const data = await Model.create({
      nom: req.body.nom,
      communeId: req.body.communeId,
    });
    return res.status(201).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création d\'un quartier';
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
    const model = await Model.findOne({ where: { id } });
    await model.destroy();
    return res.status(200).send('Quartier supprimé');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'un quartier.';
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
      'communeId',
    ].forEach(key => {
      if (req.body[key]) model[key] = req.body[key];
    });
    const data = await model.save();
    return res.status(200).send({data, msg: 'Modification effectué avec succès'});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'un quartier.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

module.exports = {
  ping,
  getAll,
  getOne,
  getQuartierByName,
  create,
  deleteOne,
  update,
};
