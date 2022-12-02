const { error: loggingError } = require('../config/logging');
// const { validationResult } = require('express-validator');
// const { Category, Food } = require('../sequelize/models');

const NAMESPACE = 'USERS_CONTROLLER';
// const Model = Category;

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
 * Permet de récuperer la liste des catégories
 * @param {Request} req
 * @param {Response} res
 */
const getAll = async (req, res) => {
  // const { offset, limit } = req.query;
  // try {
  //   const { count, rows } = await Model.findAndCountAll({
  //     offset,
  //     limit,
  //     where: {},
  //   });
  //   return res.status(200).json({ data: rows, count });
  // } catch (error) {
  //   const message = 'Erreur lors de la récupération des catégories';
  //   loggingError(NAMESPACE, message, error);
  //   return res.status(400).send({message});
  // }
  return res.status(200).send([]);
};

/**
 * Permet de récuperer une catégorie
 * @param {Request} req
 * @param {Response} res
 */
// const getOne = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   try {
//     const { id } = req.params;
//     const data = await Model.findOne({ where: { id }, include: Food });
//     return res.status(200).json(data);
//   } catch (error) {
//     const message = 'Erreur lors de la récupération d\'une catégorie';
//     loggingError(NAMESPACE, message, error);
//     return res.status(400).send({message});
//   }
// };

// const create = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   try {
//     const { title } = req.body;
//     const category = await Model.findOne({ where: {  title  } });
//     if (category) {
//       return res.status(400).json({ message: 'Ce titre est déjà utilisé pour une catégorie' });
//     }
//     const data = await Model.create({
//       title: req.body.title,
//       description: req.body.description,
//       image: req.body.image,
//     });
//     return res.status(201).send({ data });
//   } catch (error) {
//     const message = 'Erreur lors de la création d\'une catégorie';
//     loggingError(NAMESPACE, message, error);
//     return res.status(400).send({message});
//   }
// };

// const deleteOne = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   try {
//     const { id } = req.params;
//     const model = await Model.findByPk(id);
//     await model.destroy();
//     return res.status(200).send('Catégorie supprimé');
//   } catch (error) {
//     const message = 'Erreur lors de la suppression d\'une catégorie';
//     loggingError(NAMESPACE, message, error);
//     return res.status(400).send({message});
//   }
// };

// const update = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   try {
//     const { id } = req.params;
//     const model = await Model.findByPk(id);
//     const {
//       title,
//       description,
//       image,
//     } = req.body;
//     if (title) model.title = title;
//     if (description) model.description = description;
//     if (image) model.image = image;
//     const data = await model.save();
//     return res.status(200).send({data, msg: 'Modification effectué avec succès'});
//   } catch (error) {
//     const message = 'Erreur lors de la mise à jour d\'une catégorie';
//     loggingError(NAMESPACE, message, error);
//     return res.status(400).send({message});
//   }
// };

module.exports = {
  ping,
  getAll,
  // getOne,
  // create,
  // deleteOne,
  // update,
};
