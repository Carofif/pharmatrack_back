
const { Op } = require('sequelize');
const { error: loggingError } = require('../config/logging');
const { Pharmacie, PeriodeGarde, Quartier, Garde } = require('../sequelize/models');

const NAMESPACE = 'PHARMACIE_CONTROLLER';
const Model = Pharmacie;

/**
 * Permet de récuperer la liste des pharmacies
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
  const { page, limit, nom, quartierId, longitude, latitude, rayon, ouvertToutTemps, dateDeGarde } = req.query;
  const coordonnesGPS = {
    latitudeMin: latitude - rayon / 1.852 / 60,
    latitudeMax: latitude + rayon / 1.852 / 60,
    longitudeMin: longitude - rayon / 1.852 / 60,
    longitudeMax: longitude + rayon / 1.852 / 60,
  };
  const payload = {
    where: {
      nom: { [Op.iLike]: `%${nom || ''}%` },
      longitude: {
        [Op.gt]: coordonnesGPS.longitudeMin,
        [Op.lt]: coordonnesGPS.longitudeMax,
      },
      latitude: {
        [Op.gt]: coordonnesGPS.latitudeMin,
        [Op.lt]: coordonnesGPS.latitudeMax,
      },
    },
    order: [['nom', 'ASC']],
  };
  if (dateDeGarde) {
    payload.include = [{
      model: PeriodeGarde,
      as: 'periodeGardes',
      where: {
        dateDebut: { [Op.lte]: dateDeGarde },
        dateFin: { [Op.gte]: dateDeGarde }
      }
    }];
  }
  if (limit) payload.limit = limit;
  if (page) payload.offset = (page - 1) * (payload?.limit || 10);

  if (quartierId) payload.where.quartierId = { [Op.eq]: quartierId };
  if (ouvertToutTemps !== undefined) payload.where.ouvertToutTemps = { [Op.is]: ouvertToutTemps };
  try {
    const { count, rows } = await Model.findAndCountAll(payload);
    // rows.sort((a, b) => {
    //   const distanceA =
    // });
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
  try {
    const { nom } = req.params;
    const data = await Model.findOne({
      where: { nom: { [Op.iLike]: `%${nom}%` } },
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
  try {
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
  const { model } = req;
  try {
    // const { id } = req.params;
    // const model = await Model.findByPk(id);
    // TODO: Supprimer les liens
    await model.destroy();
    return res.status(200).send('Pharmacie supprimée');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'une pharmacie.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const update = async (req, res) => {
  const { model } = req;
  try {
    // const { id } = req.params;
    // const model = await Model.findByPk(id);
    let count = 0;
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
      if (req.body[key]) {
        count += 1;
        model[key] = req.body[key];}
    });
    let msg = 'Aucun modification effectué';
    if (count > 0) {
      await model.save();
      msg = 'Modification effectué avec succès';
    }
    if (req.body.periodeGardeId) {
      const where = {
        pharmacieId: model.id,
        periodeGardeId: req.body.periodeGardeId,
      };
      await Garde.findOrCreate({where, defaults: where});
      msg = 'Modification effectué avec succès';
    }
    return res.status(200).send({data: model, msg});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'une pharmacie.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

module.exports = {
  getAll,
  getOne,
  getByName,
  create,
  deleteOne,
  update,
};
