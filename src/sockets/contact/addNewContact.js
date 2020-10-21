/**
 * @param io from socket.js lib
 */

const addNewContact = (io) => {
  io.on('connection', (socket) => {
    socket.on('add-new-contact', (data) => {
      console.log(data);
      console.log(socket.request.user);
    });
  });
};

export default addNewContact;
