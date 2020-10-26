import addContact from './contact/addContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import removeRequestContactReceived from './contact/removeRequestContactReceived';

const initSockets = (io) => {
  addContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
};

export default initSockets;
