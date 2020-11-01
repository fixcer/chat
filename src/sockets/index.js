import addContact from './contact/addContact';
import removeContact from './contact/removeContact';
import removeRequestContactSent from './contact/removeRequestContactSent';
import approveRequestContactReceived from './contact/approveRequestContactReceived';
import removeRequestContactReceived from './contact/removeRequestContactReceived';
import chatPure from './chat/chatPure';
import chatImage from './chat/chatImage';
import chatFile from './chat/chatFile';
import chatVideo from './chat/chatVideo';
import typingOn from './chat/typingOn';
import typingOff from './chat/typingOff';
import userStatus from './user/userStatus';
import newGroupChat from './group/newGroupChat';

const initSockets = (io) => {
  addContact(io);
  removeContact(io);
  removeRequestContactSent(io);
  approveRequestContactReceived(io);
  removeRequestContactReceived(io);
  chatPure(io);
  chatImage(io);
  chatFile(io);
  chatVideo(io);
  typingOn(io);
  typingOff(io);
  userStatus(io);
  newGroupChat(io);
};

export default initSockets;
