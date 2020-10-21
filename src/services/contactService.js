import ContactModel from '../models/ContactModel';
import UserModel from '../models/UserModel';
import _, { reject } from 'lodash';

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

    resolve(true);
  });
};

export default { findUsersContact, addNew, removeRequestContact };
