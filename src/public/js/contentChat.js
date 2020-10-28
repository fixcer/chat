function contentChat(divId) {
  $('.emojionearea')
    .unbind('keyup')
    .on('keyup', function (element) {
      if (element.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data('chat');
        let messageVal = $(`#write-chat-${divId}`).val();

        if (!targetId.length || !messageVal.length) {
          return false;
        }

        let dataPureForSend = {
          uid: targetId,
          messageVal,
        };

        if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
          dataPureForSend.isChatGroup = true;
        }

        $.post('/message/add-new-pure', dataPureForSend, function (
          data
        ) {}).fail(function (response) {});
      }
    });
}
