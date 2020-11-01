import ChatGroupModel from '../models/ChatGroupModel';
import _ from 'lodash';

const addNewGroup = (currentUserId, memberIds, groupChatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      memberIds.unshift({ userId: `${currentUserId}` });
      memberIds = _.uniqBy(memberIds, 'userId');

      let newGroupChatItem = {
        name: groupChatName,
        userAmount: memberIds.length,
        userId: `${currentUserId}`,
        members: memberIds,
      };

      const newGroupChat = await ChatGroupModel.createNew(newGroupChatItem);
      resolve(newGroupChat);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  addNewGroup,
};
