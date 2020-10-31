import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray,
} from '../../helpers/socketHelper';

/**
 * @param io from socket.js lib
 */

const userStatus = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.request.user.chatGroupIds.forEach((group) => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    // Emit when login or F5
    socket.emit('check-users-online', Object.keys(clients));

    // Emit when another users login
    socket.broadcast.emit('broadcast-after-login', socket.request.user._id);

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(
        clients,
        socket.request.user._id,
        socket
      );
      socket.request.user.chatGroupIds.forEach((group) => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });

      // Emit when another users logout
      socket.broadcast.emit('broadcast-after-logout', socket.request.user._id);
    });
  });
};

export default userStatus;
