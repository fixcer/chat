export const pushSocketIdToArray = (clients, userId, socketId) => {
  if (clients[userId]) {
    clients[userId].push(socketId);
  } else {
    clients[userId] = [socketId];
  }

  return clients;
};

export const emitNotifyToArray = (clients, receiverUserId, io, event, data) => {
  clients[receiverUserId].forEach((socketId) => {
    return io.sockets.connected[socketId].emit(event, data);
  });
};

export const removeSocketIdFromArray = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter((socketId) => {
    return socketId != socket.id;
  });

  if (!clients[userId].length) {
    delete clients[userId];
  }

  return clients;
};
