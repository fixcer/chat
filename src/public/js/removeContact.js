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

              let checkActive = $('#all-chat')
                .find(`li[data-chat = ${targetId}]`)
                .hasClass('active');

              // Remove left side
              $('#all-chat').find(`ul a[href = "#uid_${targetId}"]`).remove();
              $('#user-chat').find(`ul a[href = "#uid_${targetId}"]`).remove();

              // Remove right side
              $('#screen-chat').find(`div#to_${targetId}`).remove();

              // Remove image modal
              $('body').find(`div#imagesModal_${targetId}`).remove();

              // Remove attachment modal
              $('body').find(`div#attachmentsModal_${targetId}`).remove();

              // Auto focus conversation
              if (checkActive) {
                $('ul.people').find('a')[0].click();
              }
            }
          },
        });
      });
    });
}

socket.on('response-remove-contact', function (user) {
  $('#contacts').find(`ul li[data-uid = ${user.id}]`).remove();
  decreaseNumberOfNotificationContact('count-contacts');

  let checkActive = $('#all-chat')
    .find(`li[data-chat = ${user.id}]`)
    .hasClass('active');

  // Remove left side
  $('#all-chat').find(`ul a[href = "#uid_${user.id}"]`).remove();
  $('#user-chat').find(`ul a[href = "#uid_${user.id}"]`).remove();

  // Remove right side
  $('#screen-chat').find(`div#to_${user.id}`).remove();

  // Remove image modal
  $('body').find(`div#imagesModal_${user.id}`).remove();

  // Remove attachment modal
  $('body').find(`div#attachmentsModal_${user.id}`).remove();

  // Auto focus conversation
  if (checkActive) {
    $('ul.people').find('a')[0].click();
  }
});

$(document).ready(function () {
  removeContact();
});
