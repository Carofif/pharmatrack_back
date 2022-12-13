const { error: loggingError } = require('../config/logging');
const { validationResult } = require('express-validator');
const { Commune, Quartier } = require('../sequelize/models');
const { Op } = require('sequelize');

const NAMESPACE = 'COMMUNE_CONTROLLER';
const Model = Commune;

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
 * Permet de récuperer la liste des communes
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
    const message = 'Erreur lors de la récupération des communes';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer une commune
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
    const data = await Model.findOne({ where: { id }, include: Quartier });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'une commune';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer une commune  avec son nom
 * @param {Request} req
 * @param {Response} res
 */
const getCommuneByName = async (req, res) => {
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
      include: Quartier });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'une commune';
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
    const { nom, arrondissementId } = req.body;
    const arrondissement = await Model.findOne({ where: { nom, arrondissementId } });
    if (arrondissement) {
      return res.status(400).json({ message: 'Cette commune existe déjà avec cet arrondissement.' });
    }
    const data = await Model.create({
      nom: req.body.nom,
      arrondissementId: req.body.arrondissementId,
    });
    return res.status(201).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création d\'une commune';
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
    const model = await Model.findOne({ where: { id }, include: [{model: Quartier, as: 'quartiers'}] });
    if (model.Quartier && Array.isArray(model.quartiers) && model.quartiers.length > 0) {
      return res.status(400).send('Cette commune ne peut pas être supprimer car il est lié à des quartiers');
    }
    else await model.destroy();
    return res.status(200).send('Commune supprimée');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'une commune.';
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
      'arrondissementId',
    ].forEach(key => {
      if (req.body[key]) model[key] = req.body[key];
    });
    const data = await model.save();
    return res.status(200).send({data, msg: 'Modification effectué avec succès'});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'une commune.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

module.exports = {
  ping,
  getAll,
  getOne,
  getCommuneByName,
  create,
  deleteOne,
  update,
};
