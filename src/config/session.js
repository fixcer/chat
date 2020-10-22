import session from 'express-session';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session);

/**
 * This variable is where save session , in this case is mongodb.
 */
const sessionStore = new MongoStore({
  url:
    'mongodb+srv://admin:admin@cluster0.xwbcv.mongodb.net/chat?retryWrites=true&w=majority',
  autoReconnect: true,
  autoRemove: 'native',
});

/**
 * Config session for app
 * @param app from exactly express module
 */
const config = (app) => {
  app.use(
    session({
      key: 'express.sid',
      secret: 'secret',
      resave: true,
      store: sessionStore,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );
};

export default { config, sessionStore };
