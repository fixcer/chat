import addContact from './contact/addContact';
import removeContact from './contact/removeContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import chatPure from './chat/chatPure';

const initSockets = (io) => {
  addContact(io);
  removeContact(io);
  removeRequestContactSent(io);
  approveRequestContactReceived(io);
  removeRequestContactReceived(io);
  chatPure(io);
};

export default initSockets;
