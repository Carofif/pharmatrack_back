const { Utilisateur } = require('../sequelize/models');
const { hashMdp } = require('../services/user');
const { generateUserToken } = require('../services/auth');

const login = (req, res) => {
  const { email } = req.body;
  try {
    const user = req.model;
    const token = generateUserToken({
      email,
      id: user.id,
      role: user.role
    });
    delete user.dataValues.motDePasse;
    return res.status(200).send({
      token,
      ...user,
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
  try {
    const { userId } = req.params;
    const user = await Utilisateur.findByPk(userId);
    user.motDePasse = hashMdp(req.body.mdpNouveau);
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