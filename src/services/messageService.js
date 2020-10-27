import ContactModel from '../models/ContactModel';
import UserModel from '../models/UserModel';
import ChatGroupModel from '../models/ChatGroupModel';
import MessageModel from '../models/MessageModel';
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
          const getMessages = await MessageModel.model.getMessages(
            currentUserId,
            conversation._id,
            LIMIT_MESSAGES_TAKEN
          );

          conversation = conversation.toObject();

          conversation.messages = getMessages;
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
        userConversations,
        groupConversations,
        allConversations,
        allConversationsWithMessages,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getAllConversationItems,
};
