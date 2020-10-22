import passportSocketIo from 'passport.socketio';

const configSocketIO = (io, cookieParser, sessionStore) => {
  io.use(
    passportSocketIo.authorize({
      cookieParser,
      key: 'express.sid',
      secret: 'secret',
      store: sessionStore,
      success: (data, accept) => {
        if (!data.user.logged_in) {
          return accept('Invalid user.', false);
        }

        return accept(null, true);
      },
      fail: (data, message, error, accept) => {
        if (error) {
          console.log('Failed connection to socket.io:', message);
          return accept(new Error(message), false);
        }
      },
    })
  );
};

export default configSocketIO;
