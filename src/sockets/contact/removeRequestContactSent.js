import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray,
} from '../../helpers/socketHelper';

/**
 * @param io from socket.js lib
 */

const removeRequestContactSent = (io) => {
  // Doi chieu userId sang socketId
  let clients = {};

  io.on('connection', (socket) => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on('remove-request-contact-sent', (data) => {
      let currentUser = {
        id: socket.request.user._id,
      };

      if (clients[data.contactId]) {
        emitNotifyToArray(
          clients,
          data.contactId,
          io,
          'response-remove-request-contact-sent',
          currentUser
        );
      }
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(
        clients,
        socket.request.user._id,
        socket
      );
    });
  });
};

export default removeRequestContactSent;
