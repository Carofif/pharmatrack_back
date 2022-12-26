const bcrypt = require('bcryptjs');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const hashMdp = mdp => bcrypt.hashSync(mdp, salt);

const compareMdp = (mdp, hashedMdp) => {
  return bcrypt.compareSync(mdp, hashedMdp);
};

const mdpValidation = (password) => {
  const REGEX_PASSWORD = /^.{6,}$/;
  return REGEX_PASSWORD.test(password);
};



module.exports = {
  hashMdp,
  compareMdp,
  mdpValidation,
};
