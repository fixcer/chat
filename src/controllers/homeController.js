import {
  notificationService,
  contactService,
  messageService,
} from '../services/index';
import {
  bufferToBase64,
  lastItemOfArray,
  convertTime,
} from '../helpers/clientHelper';
import request from 'request';

const getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // const bodyString = JSON.stringify({
    //   format: 'urls',
    // });

    // const options = {
    //   url: 'https://global.xirsys.net/_turn/fixcer-chat',
    //   method: 'PUT',
    //   headers: {
    //     Authorization:
    //       'Basic ' +
    //       Buffer.from('fixcer:4438e07e-1b6c-11eb-84f5-0242ac150002').toString(
    //         'base64'
    //       ),
    //     'Content-Type': 'application/json',
    //     'Content-Length': bodyString.length,
    //   },
    // };

    // request(options, (error, response, body) => {
    //   if (error) {
    //     return reject(error);
    //   }

    //   const bodyJSON = JSON.parse(body);
    //   resolve(bodyJSON.v.iceServers);
    // });

    resolve([]);
  });
};

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
  const allConversationsWithMessages =
    getConversations.allConversationsWithMessages;

  const iceServerList = await getICETurnServer();

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
    allConversationsWithMessages,
    bufferToBase64,
    lastItemOfArray,
    convertTime,
    iceServerList: JSON.stringify(iceServerList),
  });
};

export default { getHome };
