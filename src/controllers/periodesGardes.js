const { error: loggingError } = require('../config/logging');
const { PeriodeGarde, Garde } = require('../sequelize/models');
const { Op } = require('sequelize');

const NAMESPACE = 'ASSURANCE_CONTROLLER';
const Model = PeriodeGarde;

/**
 * Permet de récuperer la liste des périodes de gardes
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
  const { page, limit, dateDebut, dateFin } = req.query;
  const payoad = {
    where: {
      dateDebut: {
        [Op.gte] : dateDebut,
      },
      dateFin: {
        [Op.lte] : dateFin,
      },
    },
    order: [['dateDebut', 'ASC']],
  };
  if (limit) payoad.limit = limit;
  if (page) payoad.offset = (page - 1) * (payoad?.limit || 10);
  try {
    const { count, rows } = await Model.findAndCountAll(payoad);
    return res.status(200).json({ data: rows, count });
  } catch (error) {
    const message = 'Erreur lors de la récupération des périodes de gardes';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

/**
 * Permet de récuperer une période de garde
 * @param {Request} req
 * @param {Response} res
 */
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Model.findByPk(id);
    return res.status(200).json(data);
  } catch (error) {
    const message = 'Erreur lors de la récupération d\'une période de garde';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const create = async (req, res) => {
  try {
    const { dateDebut, dateFin, pharmacieId } = req.body;
    const data = await Model.create({ dateDebut, dateFin });
    if (pharmacieId) {
      await Garde.create({
        periodeGardeId: data.id,
        pharmacieId,
      });
    }
    return res.status(201).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création d\'une période de garde';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findByPk(id);
    // TODO: mettre après la gestion en déliant les pharmacies qui sont liés ou refuser la suppression
    await model.destroy();
    return res.status(200).send('Période de garde supprimée');
  } catch (error) {
    const message = 'Erreur lors de la suppression d\'une période de garde.';
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
      'dateDebut',
      'dateFin'
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
    if (req.body.pharmacieId) {
      const where = {
        periodeGardeId: id,
        pharmacieId: req.body.pharmacieId,
      };
      const link = await Garde.findOne({where});
      if (!link) await Garde.create(where);
      msg = 'Modification effectué avec succès';
    }
    return res.status(200).send({data, msg});
  } catch (error) {
    const message = 'Erreur lors de la mise à jour d\'une assurance.';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

const createAll = async (req, res) => {
  try {
    const { periodesGardes } = req.body;
    const { pharmacieId } = req.params;
    const data = await Model.bulkCreate({ periodesGardes });
    if (pharmacieId) {
      const lienGardes = [];
      data.forEach(el => {
        lienGardes.push({
          periodeGardeId: el.id,
          pharmacieId: pharmacieId,
        });
      });
      await Garde.bulkCreate({ lienGardes });
    }
    return res.status(200).send({ data });
  } catch (error) {
    const message = 'Erreur lors de la création multiple des périodes de garde';
    loggingError(NAMESPACE, message, error);
    return res.status(400).send({message});
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  deleteOne,
  update,
  createAll,
};
