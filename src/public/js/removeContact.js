function removeContact() {
  $('.user-remove-contact')
    .unbind('click')
    .on('click', function () {
      let targetId = $(this).data('uid');
      let username = $(this).parent().find('div.user-name p').text();

      Swal.fire({
        title: `Bạn có chắc chắn muốn nghỉ chơi với ${username} không?`,
        text: 'Hành động này không thể hoàn tác.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ecc71',
        cancelButtonColor: '#ff7675',
        confirmButtonText: 'Vâng, tôi chắc chắn',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (!result.value) {
          return false;
        }

        $.ajax({
          url: '/contact/remove-contact',
          type: 'delete',
          data: {
            uid: targetId,
          },
          success: function (data) {
            if (data.success) {
              $('#contacts').find(`ul li[data-uid = ${targetId}]`).remove();
              decreaseNumberOfNotificationContact('count-contacts');

              socket.emit('remove-contact', { contactId: targetId });
            }
          },
        });
      });
    });
}

socket.on('response-remove-contact', function (user) {
  $('#contacts').find(`ul li[data-uid = ${user.id}]`).remove();
  decreaseNumberOfNotificationContact('count-contacts');
});

$(document).ready(function () {
  removeContact();
});
