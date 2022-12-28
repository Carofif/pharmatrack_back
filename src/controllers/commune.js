const { Op } = require('sequelize');
const { error: loggingError } = require('../config/logging');
const { Commune, Quartier } = require('../sequelize/models');

const NAMESPACE = 'COMMUNE_CONTROLLER';
const Model = Commune;

/**
 * Permet de récuperer la liste des communes
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
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
  try {
    const { id } = req.params;
    const data = await Model.findOne({
      where: { id },
      include: [{ model: Quartier, as: 'quartiers' }],
    });
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
const getByName = async (req, res) => {
  try {
    const { nom } = req.params;
    const data = await Model.findOne({
      where: { nom: { [Op.iLike]: `%${nom}%` } },
      include: [{ model: Quartier, as: 'quartiers' }],
    });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'une commune';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const create = async (req, res) => {
  try {
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
  try {
    const { id } = req.params;
    const model = await Model.findOne({
      where: { id },
      include: [{ model: Quartier, as: 'quartiers' }],
    });
    if (model.quartiers && Array.isArray(model.quartiers) && model.quartiers.length > 0) {
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
  const { model } = req;
  try {
    // const { id } = req.params;
    // const model = await Model.findByPk(id);
    let count = 0;
    [
      'nom',
      'arrondissementId',
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
    return res.status(200).send({data: model, msg});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'une commune.';
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
