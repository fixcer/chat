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

const countNotifyUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notificationsUnread = await NotificationModel.model.countNotifyUnread(
        currentUserId
      );

      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  });
};

export default { getNotifications, countNotifyUnread };
