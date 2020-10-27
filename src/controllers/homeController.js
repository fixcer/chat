import {
  notificationService,
  contactService,
  messageService,
} from '../services/index';

const getHome = async (req, res) => {
  const userId = req.user._id;

  const notifications = await notificationService.getNotifications(userId);
  const countNotifyUnread = await notificationService.countNotifyUnread(userId);

  const contacts = await contactService.getContacts(userId);
  const contactsSent = await contactService.getContactsSent(userId);
  const contactsReceived = await contactService.getContactsReceived(userId);

  const countContacts = await contactService.countContacts(userId);
  const countContactsSent = await contactService.countContactsSent(userId);
  const countContactsReceived = await contactService.countContactsReceived(
    userId
  );

  const getConversations = await messageService.getAllConversationItems(userId);
  const allConversations = getConversations.allConversations;
  const userConversations = getConversations.userConversations;
  const groupConversations = getConversations.groupConversations;

  return res.render('main/home/index', {
    errors: req.flash('errors'),
    success: req.flash('success'),
    user: req.user,
    notifications,
    countNotifyUnread,
    contacts,
    contactsSent,
    contactsReceived,
    countContacts,
    countContactsSent,
    countContactsReceived,
    allConversations,
    userConversations,
    groupConversations,
  });
};

export default { getHome };
