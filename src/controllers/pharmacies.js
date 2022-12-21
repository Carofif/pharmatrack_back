const { error: loggingError } = require('../config/logging');
const { validationResult } = require('express-validator');
const { Pharmacie, PeriodeGarde, Quartier } = require('../sequelize/models');
const { Op } = require('sequelize');

const NAMESPACE = 'PHARMACIE_CONTROLLER';
const Model = Pharmacie;

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
 * Permet de récuperer la liste des pharmacies
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
  const { offset, limit, nom, quartierId, longitude, latitude, rayon, ouvertAllTime } = req.query;
  const coordonnesGPS = {
    latitudeMin: latitude - rayon / 1.852 / 60,
    latitudeMax: latitude + rayon / 1.852 / 60,
    longitudeMin: longitude - rayon / 1.852 / 60,
    longitudeMax: longitude + rayon / 1.852 / 60,
  };
  try {
    const { count, rows } = await Model.findAndCountAll({
      offset,
      limit,
      where: {
        nom: {
          [Op.iLike]: nom,
        },
        quartierId: {
          [Op.eq]: quartierId,
        },
        ouvertToutTemps: {
          [Op.is]: ouvertAllTime,
        },
        longitude: {
          [Op.gt]: coordonnesGPS.longitudeMin,
          [Op.lt]: coordonnesGPS.longitudeMax,
        },
        latitude: {
          [Op.gt]: coordonnesGPS.latitudeMin,
          [Op.lt]: coordonnesGPS.latitudeMax,
        },
      },
    });
    return res.status(200).json({ data: rows, count });
  } catch (error) {
    const message = 'Erreur lors de la récupération des pharmacies';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer une pharmacie
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
    const data = await Model.findOne({ where: { id }, include: [
      { model: Quartier, as: 'quartier' },
      { model: PeriodeGarde, as: 'periodeGardes' },
    ]});
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'une pharmacie';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer une pharmacie  avec son nom
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
      where: { nom: {
        [Op.iLike]: nom,
      } },
      include: [
        { model: Quartier, as: 'quartier' },
        { model: PeriodeGarde, as: 'periodeGardes' },
      ]});
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'un pharmacie';
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
    const { nom } = req.body;
    const pharma = await Model.findOne({ where: { nom } });
    if (pharma) {
      return res.status(400).json({ message: 'Cette pharmacie existe déjà.' });
    }
    const data = await Pharmacie.create({
      nom: req.body.nom,
      nomProprietaire: req.body.nomProprietaire,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      ouvertToutTemps: req.body.ouvertToutTemps,
      heureOuverture: req.body.heureOuverture,
      heureFermeture: req.body.heureFermeture,
      quartierId: req.body.quartierId,
    });
    return res.status(201).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création d\'une pharmacie';
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
    await model.destroy();
    return res.status(200).send('Pharmacie supprimée');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'une pharmacie.';
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
      'nomProprietaire',
      'latitude',
      'longitude',
      'ouvertToutTemps',
      'heureOuverture',
      'heureFermeture',
      'quartierId',
    ].forEach(key => {
      if (req.body[key]) model[key] = req.body[key];
    });
    const data = await model.save();
    return res.status(200).send({data, msg: 'Modification effectué avec succès'});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'une pharmacie.';
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