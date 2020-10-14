import express from 'express';
import { auth, home } from '../controllers/index';
import { authValid } from '../validation/index';

const router = express.Router();

/**
 * Initial all routes
 * @param app from exactly express module
 */

const initialRoutes = (app) => {
  router.get('/', home.getHome);
  router.get('/auth', auth.getAuth);
  router.post('/register', authValid.register, auth.postRegister);

  return app.use('/', router);
};

export default initialRoutes;
