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
  router.get('/', home.getHome);
  router.get('/auth', auth.getAuth);
  router.post('/register', authValid.register, auth.postRegister);
  router.get('/verify/:token', auth.verifyAccount);
  router.post(
    '/login',
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
