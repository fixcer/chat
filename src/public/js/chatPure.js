const profanityVocab = [
  'giết',
  'ngu',
  'vãi lờ',
  'vl',
  'vcl',
  'đm',
  'dm',
  'đmm',
  'dmm',
  'đậu má',
  'loz',
  'lozzz',
  'đcm',
  'dcm',
  'tổ sư',
  'tiên sư',
  'hãm loz',
  'hãm lờ',
  'súc vật',
  'á đù',
  'đù má',
  'đù',
  'lìn',
  'cc',
  'cẹc',
];

const inProfanity = (token) => {
  profanityVocab.includes(token);
};

function chatPure(divId) {
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

        // if (!messageVal.split(' ').some(inProfanity)) {
        //   Swal.fire({
        //     type: 'error',
        //     title: 'Tin nhắn của bạn không tuân theo quy tắc cộng đồng.',
        //     backdrop: 'rgba(85, 85, 85, 0.4)',
        //     width: '52rem',
        //     allowOutsideClick: false,
        //     confirmButtonColor: '#2ECC71',
        //     confirmButtonText: 'Tôi chắc chắn tuân thủ quy tắc cộng đồng.',
        //     onClose: () => {
        //       $(`#write-chat-${divId}`).val('');
        //       currentEmojiOneAre.find('.emojionearea-editor').text('');
        //     },
        //   });
        //   return false;
        // }

        let dataPureForSend = {
          uid: targetId,
          messageVal,
        };

        if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
          dataPureForSend.isChatGroup = true;
        }

        $.post('/message/add-new-pure', dataPureForSend, function (data) {
          let dataToEmit = {
            message: data.message,
          };

          let messageOfMe = $(
            `<div class="bubble me" data-mess-id="${data.message._id}"></div>`
          );

          messageOfMe.text(data.message.text);
          let convertEmojiMessage = emojione.toImage(messageOfMe.html());

          if (dataPureForSend.isChatGroup) {
            messageOfMe.html(
              `<img src="images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />
              ${convertEmojiMessage}`
            );

            increaseNumberMessageGroup(divId);
            dataToEmit.groupId = targetId;
          } else {
            messageOfMe.html(convertEmojiMessage);
            dataToEmit.contactId = targetId;
          }

          //Append message
          $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
          nineScrollRight(divId);

          //Remove value input
          $(`#write-chat-${divId}`).val('');
          currentEmojiOneAre.find('.emojionearea-editor').text('');

          //Update leftSlide
          $(`.person[data-chat = ${divId}]`)
            .find('span.time')
            .removeClass('new-message')
            .html(
              moment(data.message.createAt)
                .locale('vi')
                .startOf('seconds')
                .fromNow()
            );
          $(`.person[data-chat = ${divId}]`)
            .find('span.preview')
            .html(emojione.toImage(data.message.text));

          // Move conversation to top
          $(`.person[data-chat = ${divId}]`).on(
            'clicked.moveConversationToTheTop',
            function () {
              let dataToMove = $(this).parent();
              $(this).closest('ul').prepend(dataToMove);
              $(this).off('clicked.moveConversationToTheTop');
            }
          );
          $(`.person[data-chat = ${divId}]`).trigger(
            'clicked.moveConversationToTheTop'
          );

          //Realtime
          socket.emit('chat-pure', dataToEmit);

          //Remove typing
          typingOff(divId);

          //Remove typing when new message
          let check = $(`.chat[data-chat = ${divId}]`).find(
            'div.bubble-typing-gif'
          );

          if (check.length) {
            check.remove();
          }
        }).fail(function (error) {
          if (error.responseText === 'PROFANITY') {
            Swal.fire({
              type: 'error',
              title: 'Tin nhắn của bạn không tuân theo quy tắc cộng đồng.',
              backdrop: 'rgba(85, 85, 85, 0.4)',
              width: '52rem',
              allowOutsideClick: false,
              confirmButtonColor: '#2ECC71',
              confirmButtonText: 'Tôi chắc chắn tuân thủ quy tắc cộng đồng.',
              onClose: () => {
                $(`#write-chat-${divId}`).val('');
                currentEmojiOneAre.find('.emojionearea-editor').text('');
              },
            });
            return;
          }
          error.responseJSON.forEach((err) => {
            alertify.notify(err, 'error', 7);
          });
        });
      }
    });
}

$(document).ready(function () {
  socket.on('response-chat-pure', function (response) {
    let divId = '';

    let messageOfYou = $(
      `<div class="bubble you" data-mess-id="${response.message._id}"></div>`
    );

    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());

    if (response.currentGroupId) {
      messageOfYou.html(
        `<img src="images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />
        ${convertEmojiMessage}`
      );

      divId = response.currentGroupId;
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      divId = response.currentUserId;
      messageOfYou.html(convertEmojiMessage);
    }

    //Append message
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat = ${divId}]`)
        .find('span.time')
        .addClass('new-message');
    }

    //Update leftSlide
    $(`.person[data-chat = ${divId}]`)
      .find('span.time')
      .html(
        moment(response.message.createAt)
          .locale('vi')
          .startOf('seconds')
          .fromNow()
      );
    $(`.person[data-chat = ${divId}]`)
      .find('span.preview')
      .html(emojione.toImage(response.message.text));

    // Move conversation to top
    $(`.person[data-chat = ${divId}]`).on(
      'clicked.moveConversationToTheTop',
      function () {
        let dataToMove = $(this).parent();
        $(this).closest('ul').prepend(dataToMove);
        $(this).off('clicked.moveConversationToTheTop');
      }
    );
    $(`.person[data-chat = ${divId}]`).trigger(
      'clicked.moveConversationToTheTop'
    );
  });
});
