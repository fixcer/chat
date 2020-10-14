import { validationResult } from 'express-validator/check';

const getAuth = (req, res) => {
  return res.render('auth/index');
};

const postRegister = (req, res) => {
  const errorArray = [];
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((error) => {
      errorArray.push(error.msg);
    });

    console.log(errorArray);
    return;
  }

  console.log(req.body);
};

module.exports = { getAuth, postRegister };
