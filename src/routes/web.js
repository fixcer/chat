import express from 'express';
import { auth, home } from '../controllers/index';
import { authValid } from '../validation/index';
import passport from 'passport';
import initialPassportLocal from '../controllers/passportController/local';

// Initial all passport
initialPassportLocal();

const router = express.Router();

/**
 * Initial all routes
 * @param app from exactly express module
 */

const initialRoutes = (app) => {
  router.get('/', auth.checkLoggedIn, home.getHome);
  router.get('/logout', auth.checkLoggedIn, auth.getLogout);

  router.get('/auth', auth.checkLoggedOut, auth.getAuth);
  router.post(
    '/register',
    auth.checkLoggedOut,
    authValid.register,
    auth.postRegister
  );
  router.get('/verify/:token', auth.checkLoggedOut, auth.verifyAccount);
  router.post(
    '/login',
    auth.checkLoggedOut,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth',
      successFlash: true,
      failureFlash: true,
    })
  );

  return app.use('/', router);
};

export default initialRoutes;
