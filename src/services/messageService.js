import ContactModel from '../models/ContactModel';
import UserModel from '../models/UserModel';
import ChatGroupModel from '../models/ChatGroupModel';
import MessageModel from '../models/MessageModel';
import { transErrors } from '../../lang/vi';
import { app } from '../config/app';
import fsExtra from 'fs-extra';
import _ from 'lodash';

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;

const getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_CONVERSATIONS_TAKEN
      );

      const userConversationsPromise = await contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.userId
          );
          getUserContact.updateAt = contact.updateAt;

          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId
          );
          getUserContact.updateAt = contact.updateAt;

          return getUserContact;
        }
      });

      const userConversations = await Promise.all(userConversationsPromise);

      const groupConversations = await ChatGroupModel.getChatGroups(
        currentUserId,
        LIMIT_CONVERSATIONS_TAKEN
      );

      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updateAt;
      });

      const allConversationsWithMessagesPromise = allConversations.map(
        async (conversation) => {
          conversation = conversation.toObject();

          if (conversation.members) {
            const getMessages = await MessageModel.model.getMessagesInGroup(
              conversation._id,
              LIMIT_MESSAGES_TAKEN
            );

            conversation.messages = _.reverse(getMessages);
          } else {
            const getMessages = await MessageModel.model.getMessagesInPersonal(
              currentUserId,
              conversation._id,
              LIMIT_MESSAGES_TAKEN
            );

            conversation.messages = _.reverse(getMessages);
          }

          return conversation;
        }
      );

      let allConversationsWithMessages = await Promise.all(
        allConversationsWithMessagesPromise
      );

      allConversationsWithMessages = _.sortBy(
        allConversationsWithMessages,
        (item) => {
          return -item.updateAt;
        }
      );

      resolve({
        allConversationsWithMessages,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const addNewPure = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        const receiverExist = await ChatGroupModel.getChatGroupById(receiverId);

        if (!receiverExist) {
          return reject(transErrors.conversation_not_found);
        }

        const receiver = {
          id: receiverExist._id,
          name: receiverExist.name,
          avatar: app.avatar_group,
        };

        const newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.TEXT,
          sender,
          receiver,
          text: messageVal,
          createAt: Date.now(),
        };

        const newMessage = await MessageModel.model.addNew(newMessageItem);
        await ChatGroupModel.updateWhenHasNewMessage(
          receiverExist._id,
          receiverExist.messageAmount + 1
        );
        resolve(newMessage);
      } else {
        const receiverExist = await UserModel.getNormalUserDataById(receiverId);

        if (!receiverExist) {
          return reject(transErrors.conversation_not_found);
        }

        const receiver = {
          id: receiverExist._id,
          name: receiverExist.username,
          avatar: receiverExist.avatar,
        };

        const newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.TEXT,
          sender,
          receiver,
          text: messageVal,
          createAt: Date.now(),
        };

        const newMessage = await MessageModel.model.addNew(newMessageItem);
        await ContactModel.updateWhenHasNewMessage(
          sender.id,
          receiverExist._id
        );
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        const receiverExist = await ChatGroupModel.getChatGroupById(receiverId);

        if (!receiverExist) {
          return reject(transErrors.conversation_not_found);
        }

        const receiver = {
          id: receiverExist._id,
          name: receiverExist.name,
          avatar: app.avatar_group,
        };

        const imageBuffer = await fsExtra.readFile(messageVal.path);
        const imageContentType = messageVal.mimeType;
        const imageName = messageVal.originalname;

        const newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.IMAGE,
          sender,
          receiver,
          file: {
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName,
          },
          createAt: Date.now(),
        };

        const newMessage = await MessageModel.model.addNew(newMessageItem);
        await ChatGroupModel.updateWhenHasNewMessage(
          receiverExist._id,
          receiverExist.messageAmount + 1
        );
        resolve(newMessage);
      } else {
        const receiverExist = await UserModel.getNormalUserDataById(receiverId);

        if (!receiverExist) {
          return reject(transErrors.conversation_not_found);
        }

        const receiver = {
          id: receiverExist._id,
          name: receiverExist.username,
          avatar: receiverExist.avatar,
        };

        const imageBuffer = await fsExtra.readFile(messageVal.path);
        const imageContentType = messageVal.mimeType;
        const imageName = messageVal.originalname;

        const newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.IMAGE,
          sender,
          receiver,
          file: {
            data: imageBuffer,
            contentType: imageContentType,
            fileName: imageName,
          },
          createAt: Date.now(),
        };

        const newMessage = await MessageModel.model.addNew(newMessageItem);
        await ContactModel.updateWhenHasNewMessage(
          sender.id,
          receiverExist._id
        );
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const addNewFile = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (isChatGroup) {
        const receiverExist = await ChatGroupModel.getChatGroupById(receiverId);

        if (!receiverExist) {
          return reject(transErrors.conversation_not_found);
        }

        const receiver = {
          id: receiverExist._id,
          name: receiverExist.name,
          avatar: app.avatar_group,
        };

        const attachmentBuffer = await fsExtra.readFile(messageVal.path);
        const attachmentContentType = messageVal.mimeType;
        const attachmentName = messageVal.originalname;

        const newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.FILE,
          sender,
          receiver,
          file: {
            data: attachmentBuffer,
            contentType: attachmentContentType,
            fileName: attachmentName,
          },
          createAt: Date.now(),
        };

        const newMessage = await MessageModel.model.addNew(newMessageItem);
        await ChatGroupModel.updateWhenHasNewMessage(
          receiverExist._id,
          receiverExist.messageAmount + 1
        );
        resolve(newMessage);
      } else {
        const receiverExist = await UserModel.getNormalUserDataById(receiverId);

        if (!receiverExist) {
          return reject(transErrors.conversation_not_found);
        }

        const receiver = {
          id: receiverExist._id,
          name: receiverExist.username,
          avatar: receiverExist.avatar,
        };

        const attachmentBuffer = await fsExtra.readFile(messageVal.path);
        const attachmentContentType = messageVal.mimeType;
        const attachmentName = messageVal.originalname;

        const newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageType.FILE,
          sender,
          receiver,
          file: {
            data: attachmentBuffer,
            contentType: attachmentContentType,
            fileName: attachmentName,
          },
          createAt: Date.now(),
        };

        const newMessage = await MessageModel.model.addNew(newMessageItem);
        await ContactModel.updateWhenHasNewMessage(
          sender.id,
          receiverExist._id
        );
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreConversation = (currentUserId, skipPersonal, skipGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.readMoreContacts(
        currentUserId,
        skipPersonal,
        LIMIT_CONVERSATIONS_TAKEN
      );

      const userConversationsPromise = await contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.userId
          );
          getUserContact.updateAt = contact.updateAt;

          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId
          );
          getUserContact.updateAt = contact.updateAt;

          return getUserContact;
        }
      });

      const userConversations = await Promise.all(userConversationsPromise);

      const groupConversations = await ChatGroupModel.readMoreChatGroups(
        currentUserId,
        skipGroup,
        LIMIT_CONVERSATIONS_TAKEN
      );

      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updateAt;
      });

      const allConversationsWithMessagesPromise = allConversations.map(
        async (conversation) => {
          conversation = conversation.toObject();

          if (conversation.members) {
            const getMessages = await MessageModel.model.getMessagesInGroup(
              conversation._id,
              LIMIT_MESSAGES_TAKEN
            );

            conversation.messages = _.reverse(getMessages);
          } else {
            const getMessages = await MessageModel.model.getMessagesInPersonal(
              currentUserId,
              conversation._id,
              LIMIT_MESSAGES_TAKEN
            );

            conversation.messages = _.reverse(getMessages);
          }

          return conversation;
        }
      );

      let allConversationsWithMessages = await Promise.all(
        allConversationsWithMessagesPromise
      );

      allConversationsWithMessages = _.sortBy(
        allConversationsWithMessages,
        (item) => {
          return -item.updateAt;
        }
      );

      resolve(allConversationsWithMessages);
    } catch (error) {
      reject(error);
    }
  });
};

const readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chatInGroup) {
        let getMessages = await MessageModel.model.readMoreMessagesInGroup(
          targetId,
          skipMessage,
          LIMIT_MESSAGES_TAKEN
        );

        getMessages = _.reverse(getMessages);
        return resolve(getMessages);
      }

      let getMessages = await MessageModel.model.readMoreMessagesInPersonal(
        currentUserId,
        targetId,
        skipMessage,
        LIMIT_MESSAGES_TAKEN
      );

      getMessages = _.reverse(getMessages);
      return resolve(getMessages);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getAllConversationItems,
  addNewPure,
  addNewImage,
  addNewFile,
  readMoreConversation,
  readMore,
};
