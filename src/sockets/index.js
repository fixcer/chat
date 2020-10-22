import addContact from './contact/addContact';
import removeRequestContact from './contact/removeRequestContact';

const initSockets = (io) => {
  addContact(io);
  removeRequestContact(io);
};

export default initSockets;
