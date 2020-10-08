import express from 'express';
import { auth, home } from '../controllers/index';

const router = express.Router();

/**
 * Initial all routes
 * @param app from exactly express module
 */

const initialRoutes = (app) => {
  router.get('/', home.getHome);
  router.get('/login-register', auth.getLoginRegister);

  return app.use('/', router);
};

export default initialRoutes;
