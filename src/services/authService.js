import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { transErrors, transSuccess } from '../../lang/vi';

const saltRounds = 8;

const register = (email, gender, password) => {
  return new Promise(async (resolve, reject) => {
    const userExist = await UserModel.findByEmail(email);

    if (userExist) {
      if (userExist.deleteAt != null) {
        return reject(transErrors.account_removed);
      }
      if (!userExist.local.isActive) {
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.email_in_use);
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const userItem = {
      username: email.split('@')[0],
      gender,
      local: {
        email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4(),
      },
    };

    const user = await UserModel.createNew(userItem);
    resolve(transSuccess.userCreated(user.local.email));
  });
};

module.exports = { register };
