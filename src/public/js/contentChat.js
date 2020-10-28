function contentChat(divId) {
  $('.emojionearea')
    .unbind('keyup')
    .on('keyup', function (element) {
      let currentEmojiOneAre = $(this);

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

        $.post('/message/add-new-pure', dataPureForSend, function (data) {
          let messageOfMe = $(
            `<div class="bubble me" data-mess-id="${data.message._id}"></div>`
          );

          if (dataPureForSend.isChatGroup) {
            messageOfMe.html(
              `<img src="images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`
            );
            messageOfMe.text(data.message.text);

            increaseNumberMessageGroup(divId);
          } else {
            messageOfMe.text(data.message.text);
          }

          let convertEmojiMessage = emojione.toImage(messageOfMe.html());
          messageOfMe.html(convertEmojiMessage);

          //Append message
          $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
          nineScrollRight(divId);

          //Remove value input
          $(`#write-chat-${divId}`).val('');
          currentEmojiOneAre.find('.emojionearea-editor').text('');

          //Update leftSlide
          $(`.person[data-chat = ${divId}]`)
            .find('span.time')
            .html(
              moment(data.message.createAt)
                .locale('vi')
                .startOf('seconds')
                .fromNow()
            );
          $(`.person[data-chat = ${divId}]`)
            .find('span.preview')
            .html(emojione.toImage(data.message.text));

          // Move convsersation to top
          $(`.person[data-chat = ${divId}]`).on(
            'click.moveConversationToTheTop',
            function () {
              let dataToMove = $(this).parent();
              $(this).closest('ul').prepend(dataToMove);
              $(this).off('click.moveConversationToTheTop');
            }
          );
          $(`.person[data-chat = ${divId}]`).click();

          //Realtime
        }).fail(function (error) {
          error.responseJSON.forEach((err) => {
            alertify.notify(err, 'error', 7);
          });
        });
      }
    });
}
