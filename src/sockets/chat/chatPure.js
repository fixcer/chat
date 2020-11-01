import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray,
} from '../../helpers/socketHelper';

/**
 * @param io from socket.js lib
 */

const chatPure = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.request.user.chatGroupIds.forEach((group) => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    // When has new group chat
    socket.on('new-group-created', (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
    });

    socket.on('receiver-notify-group-created', (data) => {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    socket.on('chat-pure', (data) => {
      if (data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
          currentGroupId: data.groupId,
        };

        if (clients[data.groupId]) {
          emitNotifyToArray(
            clients,
            data.groupId,
            io,
            'response-chat-pure',
            response
          );
        }
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
        };

        if (clients[data.contactId]) {
          emitNotifyToArray(
            clients,
            data.contactId,
            io,
            'response-chat-pure',
            response
          );
        }
      }
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(
        clients,
        socket.request.user._id,
        socket
      );
      socket.request.user.chatGroupIds.forEach((group) => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
};

export default chatPure;
