import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { transErrors, transSuccess, transEmail } from '../../lang/vi';
import sendMail from '../config/mailer';

const saltRounds = 8;

const register = (email, gender, password, protocol, host) => {
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
    const linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    sendMail(email, transEmail.subject, transEmail.template(linkVerify))
      .then(() => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async (error) => {
        // Xoa user do user da tao nhung gui mail khong thanh cong
        await UserModel.removeById(user._id);
        reject(transEmail.send_failed);
      });
  });
};

const verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    const tokenExist = await UserModel.findByToken(token);

    if (!tokenExist) {
      return reject(transErrors.token_undefined);
    }

    await UserModel.verify(token);
    resolve(transSuccess.account_active);
  });
};

module.exports = { register, verifyAccount };
