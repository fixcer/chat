function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: '/notification/mark-all-as-read',
    type: 'put',
    data: { targetUsers },
    success: function (result) {
      if (result) {
        targetUsers.forEach(function (uid) {
          $('.noti_content')
            .find(`div[data-uid = ${uid}]`)
            .removeClass('noti-read-false');

          $('ul.list-notifications')
            .find(`li>div[data-uid = ${uid}]`)
            .removeClass('noti-read-false');
        });
      }

      decreaseNumberOfNotification('noti_counter', targetUsers.length);
    },
  });
}

$(document).ready(function () {
  $('#popup-mark-notif-as-read').bind('click', function () {
    let targetUsers = [];

    $('.noti_content')
      .find('div.noti-read-false')
      .each(function (index, notification) {
        targetUsers.push($(notification).data('uid'));
      });

    if (!targetUsers.length) {
      alertify.notify('Bạn không còn thông báo nào chưa đọc.', 'error', 7);
      return false;
    }

    markNotificationsAsRead(targetUsers);
  });

  $('#modal-mark-notif-as-read').bind('click', function () {
    let targetUsers = [];

    $('ul.list-notifications')
      .find('li>div.noti-read-false')
      .each(function (index, notification) {
        targetUsers.push($(notification).data('uid'));
      });

    if (!targetUsers.length) {
      alertify.notify('Bạn không còn thông báo nào chưa đọc.', 'error', 7);
      return false;
    }

    markNotificationsAsRead(targetUsers);
  });
});
