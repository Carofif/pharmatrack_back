const { Op } = require('sequelize');
const { error: loggingError } = require('../config/logging');
const { Quartier } = require('../sequelize/models');

const NAMESPACE = 'COMMUNE_CONTROLLER';
const Model = Quartier;

/**
 * Permet de récuperer la liste des quartiers
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
const getByName = async (req, res) => {
  try {
    const { nom } = req.params;
    const data = await Model.findOne({
      where: { nom: { [Op.iLike]: `%${nom}%` } },
    });
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'un quartier';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const create = async (req, res) => {
  try {
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
  try {
    const { id } = req.params;
    const data = await Model.findByPk(id);
    let count = 0;
    [
      'nom',
      'communeId',
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
    const message = 'Erreur lors de la mise à jour d\'un quartier.';
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
