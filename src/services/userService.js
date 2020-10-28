import UserModel from '../models/UserModel';
import { transErrors } from '../../lang/vi';
import bcrypt from 'bcrypt';

const saltRounds = 8;

const updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

const updatePassword = (id, item) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);

    if (!currentUser) {
      return reject(transErrors.account_undefined);
    }

    let checkCurrentPassword = await currentUser.comparePassword(
      item.currentPassword
    );

    if (!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    await UserModel.updatePassword(id, bcrypt.hashSync(item.newPassword, salt));
    resolve(true);
  });
};

module.exports = { updateUser, updatePassword };
