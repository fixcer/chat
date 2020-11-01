import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray,
} from '../../helpers/socketHelper';

/**
 * @param io from socket.js lib
 */

const typingOn = (io) => {
  let clients = {};

  io.on('connection', (socket) => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.request.user.chatGroupIds.forEach((group) => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on('new-group-created', (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);

      const response = {
        groupChat: data.groupChat,
      };

      data.groupChat.members.forEach((member) => {
        if (
          clients[member.userId] &&
          member.userId != socket.request.user._id
        ) {
          emitNotifyToArray(
            clients,
            member.userId,
            io,
            'request-new-group-created',
            response
          );
        }
      });
    });

    socket.on('receiver-notify-group-created', (data) => {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
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

export default typingOn;
