import addContact from './contact/addContact';
import removeRequestContactSent from './contact/removeRequestContactSent';

const initSockets = (io) => {
  addContact(io);
  removeRequestContactSent(io);
};

export default initSockets;
