function readMoreMessage() {
  $('.right .chat').scroll(function () {
    // get the first message
    let firstMessage = $(this).find('.bubble:first');
    // get position of first message
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();

    if ($(this).scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message/message-loading.gif" class="message-loading" />`;
      $(this).prepend(messageLoading);
      let thisDom = $(this);

      let targetId = $(this).data('chat');
      let skipMessage = $(this).find('div.bubble').length;
      let chatInGroup = $(this).hasClass('chat-in-group') ? true : false;

      $.get(
        `/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,
        function (data) {
          if (data.rightSideData.trim() === '') {
            alertify.notify('Bạn không còn tin nhắn nào.', 'error', 7);

            thisDom.find('img.message-loading').remove();
            return false;
          }

          // right side
          $(`.right .chat[data-chat = ${targetId}]`).prepend(
            data.rightSideData
          );

          // prevent scroll
          $(`.right .chat[data-chat = ${targetId}]`).scrollTop(
            firstMessage.offset().top - currentOffset
          );

          // convert emoji
          convertEmoji();

          // image modal
          $(`#imagesModal_${targetId}`)
            .find('div.all-images')
            .append(data.imageModalData);

          // call gridPhoto
          gridPhotos(5);

          // attachment modal
          $(`#attachmentsModal_${targetId}`)
            .find('ul.list-attachments')
            .append(data.attachmentModalData);

          // remove message loading
          thisDom.find('img.message-loading').remove();
        }
      );
    }
  });
}

$(document).ready(function () {
  readMoreMessage();
});
