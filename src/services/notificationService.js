import NotificationModel from '../models/NotificationModel';
import UserModel from '../models/UserModel';

const getNotifications = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await NotificationModel.model.getByUserIdAndLimit(
        currentUserId,
        limit
      );

      const notifyContents = notifications.map(async (notification) => {
        const sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(
          notification.type,
          notification.isRead,
          sender._id,
          sender.username,
          sender.avatar
        );
      });

      resolve(await Promise.all(notifyContents));
    } catch (error) {
      reject(error);
    }
  });
};

export default { getNotifications };
