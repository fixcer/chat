function chatFile(divId) {
  $(`#attachment-chat-${divId}`)
    .unbind('change')
    .on('change', function () {
      const fileData = $(this).prop('files')[0];
      const limit = 1048576;

      if (fileData.size > limit) {
        alertify.notify(
          'Kích thước tệp vượt quá giới hạn cho phép',
          'error',
          7
        );
        $(this).val(null);
        return false;
      }

      let targetId = $(this).data('chat');
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append('my-attachment-chat', fileData);
      messageFormData.append('uid', targetId);

      if ($(this).hasClass('chat-in-group')) {
        messageFormData.append('isChatGroup', true);
        isChatGroup = true;
      }

      $.ajax({
        url: '/message/add-new-file',
        type: 'post',
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function (data) {
          let dataToEmit = { message: data.message };

          let messageOfMe = $(
            `<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`
          );

          let attachmentChat = `
            <a href="data:${
              data.message.file.contentType
            }; base64, ${bufferToBase64(
            data.message.file.data.data
          )}" download="${data.message.file.fileName}">
              ${data.message.file.fileName}
            </a>
          `;

          if (isChatGroup) {
            messageOfMe.html(
              `<img src="images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />
              ${attachmentChat}`
            );

            increaseNumberMessageGroup(divId);
            dataToEmit.groupId = targetId;
          } else {
            messageOfMe.html(attachmentChat);
            dataToEmit.contactId = targetId;
          }

          //Append message
          $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
          nineScrollRight(divId);

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
            .html('Tệp đính kèm...');

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
          socket.emit('chat-file', dataToEmit);

          //Add to modal all attachment
          $(`#attachmentsModal_${divId}`).find('ul.list-attachments').append(`
            <li>
              <a href="data:${
                data.message.file.contentType
              }; base64, ${bufferToBase64(
            data.message.file.data.data
          )}" download="${data.message.file.fileName}">
                ${data.message.file.fileName}
              </a>
            </li>
          `);
        },
        error: function (error) {
          alertify.notify(error.responseText, 'error', 7);
        },
      });
    });
}

$(document).ready(function () {
  socket.on('response-chat-file', function (response) {
    let divId = '';

    let messageOfYou = $(
      `<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`
    );

    let attachmentChat = `
      <a href="data:${
        response.message.file.contentType
      }; base64, ${bufferToBase64(
      response.message.file.data.data
    )}" download="${response.message.file.fileName}">
        ${response.message.file.fileName}
      </a>
    `;

    if (response.currentGroupId) {
      messageOfYou.html(
        `<img src="images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />
        ${attachmentChat}`
      );

      divId = response.currentGroupId;
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        increaseNumberMessageGroup(divId);
      }
    } else {
      divId = response.currentUserId;
      messageOfYou.html(attachmentChat);
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
      .html('Tệp đính kèm...');

    //Move conversation to top
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

    //Add to modal all image
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      $(`#attachmentsModal_${divId}`)
        .find('ul.list-attachments')
        .append(
          `<li>
            <a href="data:${
              response.message.file.contentType
            }; base64, ${bufferToBase64(
            response.message.file.data.data
          )}" download="${response.message.file.fileName}">
              ${response.message.file.fileName}
            </a>
          </li>`
        );
    }
  });
});
