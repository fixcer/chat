import ContactModel from '../models/ContactModel';
import UserModel from '../models/UserModel';
import NotificationModel from '../models/NotificationModel';
import _ from 'lodash';

const LIMIT_NOTIFY_TAKEN = 10;

const findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);

    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });

    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    let users = await UserModel.findAllForAddContact(
      deprecatedUserIds,
      keyword
    );

    resolve(users);
  });
};

const addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExist = await ContactModel.checkExist(currentUserId, contactId);

    if (contactExist) {
      return reject(false);
    }

    let newContactItem = {
      userId: currentUserId,
      contactId,
    };

    let newContact = await ContactModel.createNew(newContactItem);

    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotificationModel.types.ADD_CONTACT,
    };

    await NotificationModel.model.createNew(notificationItem);
    resolve(newContact);
  });
};

const removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removed = await ContactModel.removeRequestContact(
      currentUserId,
      contactId
    );

    if (removed.n === 0) {
      return reject(false);
    }

    await NotificationModel.model.removeRequestContactNotification(
      currentUserId,
      contactId,
      NotificationModel.types.ADD_CONTACT
    );
    resolve(true);
  });
};

const getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContacts(
        currentUserId,
        LIMIT_NOTIFY_TAKEN
      );

      const users = await contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContactsSent(
        currentUserId,
        LIMIT_NOTIFY_TAKEN
      );

      const users = await contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const getContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.getContactsReceived(
        currentUserId,
        LIMIT_NOTIFY_TAKEN
      );

      const users = await contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const countContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await ContactModel.countContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const countContactsSent = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await ContactModel.countContactsSent(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const countContactsReceived = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await ContactModel.countContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.readMoreContacts(
        currentUserId,
        skipNumberContacts,
        LIMIT_NOTIFY_TAKEN
      );

      const users = contacts.map(async (contact) => {
        if (contact.contactId == currentUserId) {
          return await UserModel.getNormalUserDataById(contact.userId);
        } else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContactsSent = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.readMoreContactsSent(
        currentUserId,
        skipNumberContacts,
        LIMIT_NOTIFY_TAKEN
      );

      const users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

const readMoreContactsReceived = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contacts = await ContactModel.readMoreContactsReceived(
        currentUserId,
        skipNumberContacts,
        LIMIT_NOTIFY_TAKEN
      );

      const users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  findUsersContact,
  addNew,
  removeRequestContact,
  getContacts,
  getContactsSent,
  getContactsReceived,
  countContacts,
  countContactsSent,
  countContactsReceived,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived,
};
