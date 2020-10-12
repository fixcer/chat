import { validationResult } from 'express-validator/check';

const getLoginRegister = (req, res) => {
  return res.render('auth/index');
};

const postRegister = (req, res) => {
  console.log(validationResult(req));
};

module.exports = { getLoginRegister, postRegister };
