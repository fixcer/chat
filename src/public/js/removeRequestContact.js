function removeRequestContact() {
  $('.user-remove-request-contact').bind('click', function () {
    let targetId = $(this).data('uid');
    $.ajax({
      url: '/contact/remove-request-contact',
      type: 'delete',
      data: {
        uid: targetId,
      },
      success: function (data) {
        if (data.success) {
          $('#find-user')
            .find(`div.user-add-new-contact[data-uid = ${targetId}]`)
            .css('display', 'inline-block');

          $('#find-user')
            .find(`div.user-remove-request-contact[data-uid = ${targetId}]`)
            .hide();

          decreaseNumberOfNotificationContact('count-request-contact-sent');

          socket.emit('remove-request-contact', { contactId: targetId });
        }
      },
    });
  });
}

socket.on('response-remove-request-contact', function (user) {
  $('.noti_content').find(`span[data-uid = ${user.id}]`).remove();
  decreaseNumberOfNotificationContact('count-request-contact-received');
  decreaseNumberOfNotification('noti_contact_counter');
  decreaseNumberOfNotification('noti_counter');
});
