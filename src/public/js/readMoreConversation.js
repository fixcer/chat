$(document).ready(function () {
  $('#link-read-more-all-chat').bind('click', function () {
    const skipPersonal = $('#all-chat').find('li:not(.group-chat)').length;
    const skipGroup = $('#all-chat').find('li.group-chat').length;

    $('#link-read-more-all-chat').css('display', 'none');
    $('.read-more-all-chat-loader').css('display', 'inline-block');

    $.get(
      `/message/read-more-conversation?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`,
      function (data) {
        if (data.leftSideData.trim() === '') {
          alertify.notify('Bạn không còn cuộc trò chuyện nào.', 'error', 7);

          $('#link-read-more-all-chat').css('display', 'inline-block');
          $('.read-more-all-chat-loader').css('display', 'none');
          return false;
        }

        // left side
        $('#all-chat').find('ul').append(data.leftSideData);

        // scroll left
        resizeNineScrollLeft();
        nineScrollLeft();

        // right side
        $('#screen-chat').append(data.rightSideData);

        // call changeScreenChat
        changeScreenChat();

        // convert emoji
        convertEmoji();

        // image modal
        $('body').append(data.imageModalData);

        // call gridPhoto
        gridPhotos(5);

        // attachment modal
        $('body').append(data.attachmentModalData);

        // update online
        socket.emit('check-status');

        $('#link-read-more-all-chat').css('display', 'inline-block');
        $('.read-more-all-chat-loader').css('display', 'none');
      }
    );
  });
});
