function addFriendsToGroup() {
  $('ul#group-chat-friends')
    .find('div.add-user')
    .bind('click', function () {
      let uid = $(this).data('uid');
      $(this).remove();
      let html = $('ul#group-chat-friends')
        .find('div[data-uid=' + uid + ']')
        .html();

      let promise = new Promise(function (resolve, reject) {
        $('ul#friends-added').append(html);
        $('#groupChatModal .list-user-added').show();
        resolve(true);
      });
      promise.then(function (success) {
        $('ul#group-chat-friends')
          .find('div[data-uid=' + uid + ']')
          .remove();
      });
    });
}

function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function () {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriends(element) {
  if (element.which === 13 || element.type === 'click') {
    let keyword = $('#input-search-friends-to-add-group-chat').val();
    let regexKeyword = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    );

    if (!keyword.length) {
      alertify.notify('Chưa nhập nội dung tìm kiếm.', 'error', 7);
      return false;
    }

    if (!regexKeyword.test(keyword)) {
      alertify.notify('Từ khóa tìm kiếm không hợp lệ.', 'error', 7);
      return false;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $('ul#group-chat-friends').html(data);

      addFriendsToGroup();
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat() {
  $('#btn-create-group-chat')
    .unbind('click')
    .on('click', function () {
      let countUsers = $('ul#friends-added').find('li');
      if (countUsers.length < 2) {
        alertify.notify('Tối thiểu phải có 3 thành viên.', 'error', 7);
        return false;
      }

      let groupChatName = $('#input-name-group-chat').val();
      let regexGroupChatName = new RegExp(
        /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
      );

      if (
        !regexGroupChatName.test(groupChatName) ||
        groupChatName.length < 3 ||
        groupChatName.length > 64
      ) {
        alertify.notify('Tên nhóm không hợp lệ.', 'error', 7);
        return false;
      }

      let ids = [];
      $('ul#friends-added')
        .find('li')
        .each(function (index, item) {
          ids.push({ userId: $(item).data('uid') });
        });

      Swal.fire({
        title: `Bạn có chắc muốn tạo nhóm &nbsp; ${groupChatName}?`,
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2ecc71',
        cancelButtonColor: '#ff7675',
        confirmButtonText: 'Vâng, tôi chắc chắn',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (!result.value) {
          return false;
        }

        $.post('/group-chat/add-new', { ids, groupChatName }, function (data) {
          // Hide modal create group
          $('#input-name-group-chat').val('');
          $('#btn-cancel-group-chat').click();
          $('#groupChatModal').modal('hide');

          // Add group to leftSide
          let subGroupChatName = data.groupChat.name;
          if (subGroupChatName.length > 15) {
            subGroupChatName = subGroupChatName.subStr(0, 11);
          }
          let leftSideData = `
            <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
              <li class="person group-chat" data-chat="${data.groupChat._id}">
                <div class="left-avatar">
                  <img src="images/users/group-avatar.png" alt="" />
                </div>
                <span class="name">
                  <span class="group-chat-name">
                    ${subGroupChatName}<span>...</span>
                  </span>
                </span>
                <span class="time"></span>
                <span class="preview convert-emoji"></span>
              </li>
            </a>  
          `;
          $('#all-chat').find('ul').prepend(leftSideData);
          $('#group-chat').find('ul').append(leftSideData);

          // Display right side
          let rightSideData = `
            <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
              <div class="top">
                <span>To: <span class="name">${data.groupChat.name}</span></span>
                <span class="chat-menu-right">
                  <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                    Tệp đính kèm
                    <i class="fa fa-paperclip"></i>
                  </a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                  <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                    Hình ảnh
                    <i class="fa fa-photo"></i>
                  </a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                    <span class="show-number-members">${data.groupChat.userAmount}</span>
                    <i class="fa fa-users"></i>
                  </a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                    <span class="show-number-messages">${data.groupChat.messageAmount}</span>
                    <i class="fa fa-comments-o"></i>
                  </a>
                </span>
              </div>
              <div class="content-chat">
                <div class="chat" data-chat="${data.groupChat._id}"></div>
              </div>
              <div class="write" data-chat="${data.groupChat._id}">
                <input type="text" id="write-chat-${data.groupChat._id}" class="write-chat chat-in-group"
                  data-chat="${data.groupChat._id}" />
                <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${data.groupChat._id}">
                    <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
                      class="image-chat chat-in-group" data-chat="${data.groupChat._id}" />
                    <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachment-chat-${data.groupChat._id}">
                    <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat"
                      class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}" />
                    <i class="fa fa-paperclip"></i>
                  </label>
                  <a href="javascript:void(0)" id="video-chat-group">
                    <i class="fa fa-video-camera"></i>
                  </a>
                </div>
              </div>
            </div>
          `;
          $('#screen-chat').prepend(rightSideData);

          // Call function changeScreenChat
          changeScreenChat();

          // Image modal
          let imageModalData = `
            <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">
                      &times;
                    </button>
                    <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện.</h4>
                  </div>
                  <div class="modal-body">
                    <div class="all-images" style="visibility: hidden"></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          $('body').append(imageModalData);

          // call gridPhotos
          gridPhotos(5);

          // Attachment modal
          let attachmentModalData = `
            <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">
                      &times;
                    </button>
                    <h4 class="modal-title">Những tệp đính kèm trong cuộc trò chuyện.</h4>
                  </div>
                  <div class="modal-body">
                    <ul class="list-attachments"></ul>
                  </div>
                </div>
              </div>
            </div>
          `;
          $('body').append(attachmentModalData);

          // Emit has new group
          socket.emit('new-group-created', { groupChat: data.groupChat });

          // Update online
          socket.emit('check-status');
        }).fail(function (response) {
          alertify.notify(response.responseText, 'error', 7);
        });
      });
    });
}

$(document).ready(function () {
  $('#input-search-friends-to-add-group-chat').bind(
    'keypress',
    callSearchFriends
  );

  $('#btn-search-friends-to-add-group-chat').bind('click', callSearchFriends);
  callCreateGroupChat();

  socket.on('request-new-group-created', function (response) {
    // Add group to leftSide
    let subGroupChatName = response.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.subStr(0, 11);
    }

    let leftSideData = `
      <a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
        <li class="person group-chat" data-chat="${response.groupChat._id}">
          <div class="left-avatar">
            <img src="images/users/group-avatar.png" alt="" />
          </div>
          <span class="name">
            <span class="group-chat-name">
              ${subGroupChatName}<span>...</span>
            </span>
          </span>
          <span class="time"></span>
          <span class="preview convert-emoji"></span>
        </li>
      </a>  
    `;
    $('#all-chat').find('ul').prepend(leftSideData);
    $('#group-chat').find('ul').append(leftSideData);

    // Display right side
    let rightSideData = `
      <div class="right tab-pane" data-chat="${response.groupChat._id}" id="to_${response.groupChat._id}">
        <div class="top">
          <span>To: <span class="name">${response.groupChat.name}</span></span>
          <span class="chat-menu-right">
            <a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
              Tệp đính kèm
              <i class="fa fa-paperclip"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-members" data-toggle="modal">
              <span class="show-number-members">${response.groupChat.userAmount}</span>
              <i class="fa fa-users"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
              <span class="show-number-messages">${response.groupChat.messageAmount}</span>
              <i class="fa fa-comments-o"></i>
            </a>
          </span>
        </div>
        <div class="content-chat">
          <div class="chat" data-chat="${response.groupChat._id}"></div>
        </div>
        <div class="write" data-chat="${response.groupChat._id}">
          <input type="text" id="write-chat-${response.groupChat._id}" class="write-chat chat-in-group"
            data-chat="${response.groupChat._id}" />
          <div class="icons">
            <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
            <label for="image-chat-${response.groupChat._id}">
              <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat"
                class="image-chat chat-in-group" data-chat="${response.groupChat._id}" />
              <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${response.groupChat._id}">
              <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat"
                class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}" />
              <i class="fa fa-paperclip"></i>
            </label>
            <a href="javascript:void(0)" id="video-chat-group">
              <i class="fa fa-video-camera"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    $('#screen-chat').prepend(rightSideData);

    // Call function changeScreenChat
    changeScreenChat();

    // Image modal
    let imageModalData = `
      <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
              <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện.</h4>
            </div>
            <div class="modal-body">
              <div class="all-images" style="visibility: hidden"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(imageModalData);

    // call gridPhotos
    gridPhotos(5);

    // Attachment modal
    let attachmentModalData = `
      <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
              <h4 class="modal-title">Những tệp đính kèm trong cuộc trò chuyện.</h4>
            </div>
            <div class="modal-body">
              <ul class="list-attachments"></ul>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(attachmentModalData);

    // Emit receiver notify group created
    socket.emit('receiver-notify-group-created', {
      groupChatId: response.groupChat._id,
    });

    // Update online
    socket.emit('check-status');
  });
});
