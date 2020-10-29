function chatImage(divId) {
  $(`#image-chat-${divId}`)
    .unbind('change')
    .on('change', function () {
      const fileData = $(this).prop('files')[0];
      const match = ['image/png', 'image/jpg', 'image/jpeg'];
      const limit = 1048576;

      if ($.inArray(fileData.type, match) === -1) {
        alertify.notify('Định dạng file không hợp lệ', 'error', 7);
        $(this).val(null);
        return false;
      }

      if (fileData.size > limit) {
        alertify.notify(
          'Kích thước ảnh vượt quá giới hạn cho phép',
          'error',
          7
        );
        $(this).val(null);
        return false;
      }

      let targetId = $(this).data('chat');

      let messageFormData = new FormData();
      messageFormData.append('my-image-chat', fileData);
      messageFormData.append('uid', targetId);

      if ($(this).hasClass('chat-in-group')) {
        messageFormData.append('isChatGroup', true);
      }

      $.ajax({
        url: '/message/add-new-image',
        type: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function (data) {
          console.log(data);
        },
        error: function (error) {
          alertify.notify(error.responseText, 'error', 7);
        },
      });
    });
}

$(document).ready(function () {});
