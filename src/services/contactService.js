import ContactModel from '../models/ContactModel';
import UserModel from '../models/UserModel';
import _ from 'lodash';

const findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [];
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

export default { findUsersContact };
