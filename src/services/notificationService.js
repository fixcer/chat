import NotificationModel from '../models/NotificationModel';
import UserModel from '../models/UserModel';

const LIMIT_NOTIFY_TAKEN = 10;

const getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await NotificationModel.model.getByUserIdAndLimit(
        currentUserId,
        LIMIT_NOTIFY_TAKEN
      );

      const notifyContents = notifications.map(async (notification) => {
        const sender = await UserModel.getNormalUserDataById(
          notification.senderId
        );
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

const readMore = (currentUserId, skipNumberNotify) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newNotifications = await NotificationModel.model.readMore(
        currentUserId,
        skipNumberNotify,
        LIMIT_NOTIFY_TAKEN
      );

      const notifyContents = newNotifications.map(async (notification) => {
        const sender = await UserModel.getNormalUserDataById(
          notification.senderId
        );
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

const markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resolve(true);
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};

export default { getNotifications, countNotifyUnread, readMore, markAllAsRead };
