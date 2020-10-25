import express from 'express';
import { auth, home, user, contact, notification } from '../controllers/index';
import { authValid, userValid, contactValid } from '../validation/index';
import passport from 'passport';
import initialPassportLocal from '../controllers/passportController/local';
import initialPassportFacebook from '../controllers/passportController/facebook';
import initialPassportGoogle from '../controllers/passportController/google';

// Initial all passport
initialPassportLocal();
initialPassportFacebook();
initialPassportGoogle();

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
  router.get(
    '/auth/facebook',
    auth.checkLoggedOut,
    passport.authenticate('facebook', { scope: ['email'] })
  );
  router.get(
    '/auth/facebook/callback',
    auth.checkLoggedOut,
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/auth',
    })
  );
  router.get(
    '/auth/google',
    auth.checkLoggedOut,
    passport.authenticate('google', { scope: ['email', 'profile'] })
  );
  router.get(
    '/auth/google/callback',
    auth.checkLoggedOut,
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/auth',
    })
  );

  router.put('/user/update-avatar', auth.checkLoggedIn, user.updateAvatar);
  router.put(
    '/user/update-info',
    auth.checkLoggedIn,
    userValid.updateInfo,
    user.updateInfo
  );
  router.put(
    '/user/update-password',
    auth.checkLoggedIn,
    userValid.updatePassword,
    user.updatePassword
  );

  router.get(
    '/contact/find-users/:keyword',
    auth.checkLoggedIn,
    contactValid.findUsersContact,
    contact.findUsersContact
  );
  router.post('/contact/add-new', auth.checkLoggedIn, contact.addNew);
  router.delete(
    '/contact/remove-request-contact',
    auth.checkLoggedIn,
    contact.removeRequestContact
  );

  router.get(
    '/notification/read-more',
    auth.checkLoggedIn,
    notification.readMore
  );
  router.put(
    '/notification/mark-all-as-read',
    auth.checkLoggedIn,
    notification.markAllAsRead
  );

  return app.use('/', router);
};

export default initialRoutes;
