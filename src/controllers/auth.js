const { validationResult } = require('express-validator');
const { User } = require('../sequelize/models');
const { compareMdp, hashMdp } = require('../services/user');
const { generateUserToken } = require('../services/auth');

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    email,
    mdp
  } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({
        status: 'bad',
        message: 'Cet utilisateur n\'existe pas',
        name: 'NoUser'
      });
    }
    if (!compareMdp(mdp, user.mdp)) {
      return res.status(400).send({
        status: 'bad',
        message: 'Mot de passe incorrect',
        name: 'BadCompare'
      });
    }
    const token = generateUserToken({
      email,
      id: user.id,
      role: user.role
    });
    return res.status(200).send({
      token,
      id: user.id,
      role: user.role,
    });
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

const checkToken = (req, res) => {
  res.status(200).send('Success');
};

const changeMdp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findByPk(req.params.userId);
    user.mdp = hashMdp(req.body.mdpNouveau);
    await user.save();
    return res.status(200).send('Mot de passe mise à jour');
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};


module.exports = {
  login,
  checkToken,
  changeMdp,
};