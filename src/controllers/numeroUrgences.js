const { error: loggingError } = require('../config/logging');
const { validationResult } = require('express-validator');
const { NumeroUrgence, PeriodeGarde, Pharmacie/* , Garde */ } = require('../sequelize/models');

const NAMESPACE = 'NUMERO_URGENCE_CONTROLLER';
const Model = NumeroUrgence;

/**
 * Permet de tester la disponibilité de l'endpoint
 * @param {Request} req
 * @param {Response} res
 */
const ping = async (req, res) => {
  try {
    const result = await Pharmacie.findOne({
      where: { nom: 'Pharma1' },
      include: [ { model: PeriodeGarde, as: 'periodeGardes' }, ]
    });
    return res.status(200).send(result);
  } catch (error) {
    loggingError(NAMESPACE, '', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

/**
 * Permet de récuperer la liste des numéros d\'urgences
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { page, limit } = req.query;
  const payoad = {
    where: {
    },
  };
  if (limit) payoad.limit = limit;
  if (page) payoad.offset = (page - 1) * (payoad?.limit || 10);
  try {
    const { count, rows } = await Model.findAndCountAll(payoad);
    return res.status(200).json({ data: rows, count });
  } catch (error) {
    const message = 'Erreur lors de la récupération des numéros d\'urgences';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer un numero d'urgence
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
    const message = 'Erreur lors de la récupération d\'un numéro d\'urgence';
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
      description: req.body.description,
      adresse: req.body.adresse,
      services: req.body.services,
      telephone: req.body.telephone,
      telephones: req.body.telephones,
    });
    return res.status(201).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création d\'un numéro d\'urgence';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message, errorMsg: error.message});
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
    await model.destroy();
    return res.status(200).send('Numéro d\'urgence supprimé');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'un numéro d\'urgence';
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
      'description',
      'adresse',
      'services',
      'telephone',
      'telephones',
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
    const message = 'Erreur lors de la mise à jour d\'un numéro d\'urgence';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

module.exports = {
  ping,
  getAll,
  getOne,
  create,
  deleteOne,
  update,
};
