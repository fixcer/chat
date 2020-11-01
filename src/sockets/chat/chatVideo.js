import { emit } from 'nodemon';
import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray,
} from '../../helpers/socketHelper';

/**
 * @param io from socket.js lib
 */

const chatVideo = (io) => {
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

    socket.on('caller-check-listener', (data) => {
      if (clients[data.listenerId]) {
        const response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName,
        };

        emitNotifyToArray(
          clients,
          data.listenerId,
          io,
          'request-peer-id',
          response
        );
      } else {
        socket.emit('listener-offline');
      }
    });

    socket.on('listener-emit-peer-id', (data) => {
      const response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients,
          data.callerId,
          io,
          'check-status-caller',
          response
        );
      }
    });

    socket.on('call-listener-through-server', (data) => {
      const response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients,
          data.listenerId,
          io,
          'send-request-call',
          response
        );
      }
    });

    socket.on('caller-cancel', (data) => {
      const response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients,
          data.listenerId,
          io,
          'send-request-cancel-call',
          response
        );
      }
    });

    socket.on('reject-call', (data) => {
      const response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients,
          data.callerId,
          io,
          'send-reject-call',
          response
        );
      }
    });

    socket.on('accept-call', (data) => {
      const response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients,
          data.callerId,
          io,
          'send-accept-call-to-caller',
          response
        );
      }

      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients,
          data.listenerId,
          io,
          'send-accept-call-to-listener',
          response
        );
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

export default chatVideo;
