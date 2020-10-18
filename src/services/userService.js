import UserModel from '../models/UserModel';

const updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

module.exports = { updateUser };
