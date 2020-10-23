import { notification } from '.';
import { notificationService } from '../services/index';

const readMore = async (req, res) => {
  try {
    const skipNumberNotify = +req.query.skipNumber;
    const newNotifications = await notificationService.readMore(
      req.user._id,
      skipNumberNotify
    );
    return res.status(200).send(newNotifications);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default { readMore };
