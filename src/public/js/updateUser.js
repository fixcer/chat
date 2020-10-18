let userAvatar = null;
let userInfo = {};
let originAvatar = null;

function updateUserInfo() {
  $('#input-change-avatar').bind('change', function () {
    const fileData = $(this).prop('files')[0];
    const match = ['image/png', 'image/jpg', 'image/jpeg'];
    const limit = 1048576;

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify('Định dạng file không hợp lệ', 'error', 7);
      $(this).val(null);
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify('Kích thước ảnh vượt quá giới hạn cho phép', 'error', 7);
      $(this).val(null);
      return false;
    }

    if (typeof FileReader != 'undefined') {
      let imagePreview = $('#image-edit-profile');
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function (element) {
        $('<img>', {
          src: element.target.result,
          class: 'avatar img-circle',
          id: 'user-modal-avatar',
          alt: 'avatar',
        }).appendTo(imagePreview);
      };

      // Hien thi anh xem truoc
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      // Tao form neu anh hop le
      let formData = new FormData();
      formData.append('avatar', fileData);

      userAvatar = formData;
    } else {
      alertify.notify('Trình duyệt không hỗ trợ FileReader', 'error', 7);
    }
  });

  $('#input-change-username').bind('change', function () {
    userInfo.username = $(this).val();
  });
  $('#input-change-gender-male').bind('click', function () {
    userInfo.gender = $(this).val();
  });
  $('#input-change-gender-female').bind('click', function () {
    userInfo.gender = $(this).val();
  });
  $('#input-change-address').bind('change', function () {
    userInfo.address = $(this).val();
  });
  $('#input-change-phone').bind('change', function () {
    userInfo.phone = $(this).val();
  });
}

$(document).ready(function () {
  updateUserInfo();
  originAvatar = $('#user-modal-avatar').attr('src');

  $('#input-btn-update-user').bind('click', function () {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify(
        'Bạn phải thay đổi thông tin trước khi cập nhật',
        'erorr',
        3
      );

      return false;
    }

    $.ajax({
      url: '/user/update-avatar',
      type: 'put',
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function (response) {
        $('.user-modal-alert-success').find('span').text(response.message);
        $('.user-modal-alert-success').css('display', 'block');

        $('#navbar-avatar').attr('src', response.imageSrc);
        originAvatar = response.imageSrc;
      },
      error: function (error) {
        $('.user-modal-alert-error').find('span').text(error.responseText);
        $('.user-modal-alert-error').css('display', 'block');

        // Reset all if server response error
        $('#input-btn-cancel-update-user').click();
      },
    });
  });
  $('#input-btn-cancel-update-user').bind('click', function () {
    $('#input-change-avatar').val(null);
    $('#user-modal-avatar').attr('src', originAvatar);
    userAvatar = null;
    userInfo = {};
  });
});
