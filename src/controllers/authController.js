import { validationResult } from 'express-validator/check';
import { authService } from '../services/index';
import { transSuccess } from '../../lang/vi';

const getAuth = (req, res) => {
  return res.render('auth/index', {
    errors: req.flash('errors'),
    success: req.flash('success'),
  });
};

const postRegister = async (req, res) => {
  const errorArray = [];
  const successArray = [];
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((error) => {
      errorArray.push(error.msg);
    });

    req.flash('errors', errorArray);
    return res.redirect('/auth');
  }

  try {
    const user = await authService.register(
      req.body.email,
      req.body.gender,
      req.body.password,
      req.protocol,
      req.get('host')
    );
    successArray.push(user);
    req.flash('success', successArray);
    return res.redirect('/auth');
  } catch (error) {
    errorArray.push(error);
    req.flash('errors', errorArray);
    return res.redirect('/auth');
  }
};

const verifyAccount = async (req, res) => {
  const errorArray = [];
  const successArray = [];

  try {
    const verifySuccess = await authService.verifyAccount(req.params.token);

    successArray.push(verifySuccess);
    req.flash('success', successArray);
    return res.redirect('/auth');
  } catch (error) {
    errorArray.push(error);
    req.flash('errors', errorArray);
    return res.redirect('/auth');
  }
};

const getLogout = (req, res) => {
  req.logout();
  req.flash('success', transSuccess.logout_success);
  return res.redirect('/auth');
};

const checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth');
  }

  next();
};

const checkLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
};

module.exports = {
  getAuth,
  postRegister,
  verifyAccount,
  getLogout,
  checkLoggedIn,
  checkLoggedOut,
};
