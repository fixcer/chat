import { notificationService } from '../services/index';

const getHome = async (req, res) => {
  let notifications = await notificationService.getNotifications(req.user._id);
  return res.render('main/home/index', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications,
  });
};

export default { getHome };
