const { error: loggingError } = require('../config/logging');
const { validationResult } = require('express-validator');
const { Assurance } = require('../sequelize/models');
const { Op } = require('sequelize');

const NAMESPACE = 'ASSURANCE_CONTROLLER';
const Model = Assurance;

/**
 * Permet de tester la disponibilité de l'endpoint
 * @param {Request} req
 * @param {Response} res
 */
const ping = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    return res.status(200).send('ping');
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

/**
 * Permet de récuperer la liste des assurances
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { page, limit, nom } = req.query;
  const payoad = {
    where: {
      nom: { [Op.iLike]: `%${nom || ''}%` },
    },
    order: [['nom', 'ASC']],
  };
  if (limit) payoad.limit = limit;
  if (page) payoad.offset = (page - 1) * (payoad?.limit || 10);
  try {
    const { count, rows } = await Model.findAndCountAll(payoad);
    return res.status(200).json({ data: rows, count });
  } catch (error) {
    const message = 'Erreur lors de la récupération des assurances';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer une assurance
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
    const message = 'Erreur lors de la récupération d\'une assurance';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer une assurance  avec son nom
 * @param {Request} req
 * @param {Response} res
 */
const getByName = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { nom } = req.params;
    const data = await Model.findOne({
      where: { nom: { [Op.iLike]: `%${nom}%` } },
    });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'une assurance';
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
    const data = await Model.create({
      nom: req.body.nom,
    });
    return res.status(201).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création d\'une assurance';
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
    const model = await Model.findByPk(id);

    // mettre après la gestion en déliant les pharmacies qui sont liés ou refuser la suppression
    await model.destroy();
    return res.status(200).send('Assurance supprimé');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'une assurance.';
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
    const data = await Model.findByPk(id);
    let count = 0;
    [
      'nom',
    ].forEach(key => {
      if (req.body[key]) {
        count += 1;
        data[key] = req.body[key];
      }
    });
    let msg = 'Aucun modification effectué';
    if (count > 0) {
      await data.save();
      msg = 'Modification effectué avec succès';
    }
    return res.status(200).send({data, msg});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'une assurance.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

module.exports = {
  ping,
  getAll,
  getOne,
  getByName,
  create,
  deleteOne,
  update,
};
