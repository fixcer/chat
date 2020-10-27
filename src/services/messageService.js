import ContactModel from '../models/ContactModel';
import UserModel from '../models/UserModel';
import ChatGroupModel from '../models/ChatGroupModel';
import _ from 'lodash';

const LIMIT_CONVERSATIONS_TAKEN = 15;

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
          getUserContact.createAt = contact.createAt;

          return getUserContact;
        } else {
          let getUserContact = await UserModel.getNormalUserDataById(
            contact.contactId
          );
          getUserContact.createAt = contact.createAt;

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
        return -item.createAt;
      });

      resolve({ userConversations, groupConversations, allConversations });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getAllConversationItems,
};
