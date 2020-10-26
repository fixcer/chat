import addContact from './contact/addContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
import removeRequestContactReceived from './contact/removeRequestContactReceived';

const initSockets = (io) => {
  addContact(io);
  removeRequestContactSent(io);
  approveRequestContactReceived(io);
  removeRequestContactReceived(io);
};

export default initSockets;
