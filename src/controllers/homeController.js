import { notificationService, contactService } from '../services/index';

const getHome = async (req, res) => {
  const notifications = await notificationService.getNotifications(
    req.user._id
  );
  const countNotifyUnread = await notificationService.countNotifyUnread(
    req.user._id
  );

  const contacts = await contactService.getContacts(req.user._id);
  const contactsSent = await contactService.getContactsSent(req.user._id);
  const contactsReceived = await contactService.getContactsReceived(
    req.user._id
  );

  return res.render('main/home/index', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications,
    countNotifyUnread,
    contacts,
    contactsSent,
    contactsReceived,
  });
};

export default { getHome };
