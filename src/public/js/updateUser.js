let userAvatar = null;
let userInfo = {};
let originAvatar = null;
let originUserInfo = {};

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
    let username = $(this).val();
    let regexUsername = new RegExp(
      '^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$'
    );

    if (
      !regexUsername.test(username) ||
      username.length < 3 ||
      username.length > 17
    ) {
      alertify.notify('Username không hợp lệ', 'error', 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }
    userInfo.username = username;
  });
  $('#input-change-gender-male').bind('click', function () {
    let gender = $(this).val();

    if (gender !== 'male') {
      alertify.notify('Just for fun!!!', 'error', 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });
  $('#input-change-gender-female').bind('click', function () {
    let gender = $(this).val();

    if (gender !== 'female') {
      alertify.notify('Just for fun!!!', 'error', 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });
  $('#input-change-address').bind('change', function () {
    let address = $(this).val();

    if (address.length < 3 || address.length > 17) {
      alertify.notify('Địa chỉ không hợp lệ', 'error', 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.address;
      return false;
    }
    userInfo.address = address;
  });
  $('#input-change-phone').bind('change', function () {
    let phone = $(this).val();
    let regexPhone = new RegExp('^(0)[0-9]{9,10}$');

    if (!regexPhone.test(phone)) {
      alertify.notify('Số điện thoại không hợp lệ', 'error', 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = phone;
  });
}

function callUpdateUserAvatar() {
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
}

function callUpdateUserInfo() {
  $.ajax({
    url: '/user/update-info',
    type: 'put',
    data: userInfo,
    success: function (response) {
      $('.user-modal-alert-success').find('span').text(response.message);
      $('.user-modal-alert-success').css('display', 'block');

      originUserInfo = Object.assign(originUserInfo, userInfo);

      $('#navbar-username').text(originUserInfo.username);

      // Reset all if server response error
      $('#input-btn-cancel-update-user').click();
    },
    error: function (error) {
      $('.user-modal-alert-error').find('span').text(error.responseText);
      $('.user-modal-alert-error').css('display', 'block');

      // Reset all if server response error
      $('#input-btn-cancel-update-user').click();
    },
  });
}

$(document).ready(function () {
  originAvatar = $('#user-modal-avatar').attr('src');
  originUserInfo = {
    username: $('#input-change-username').val(),
    gender: $('#input-change-gender-male').is(':checked')
      ? $('#input-change-gender-male').val()
      : $('#input-change-gender-female').val(),
    address: $('#input-change-address').val(),
    phone: $('#input-change-phone').val(),
  };

  updateUserInfo();

  $('#input-btn-update-user').bind('click', function () {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify(
        'Bạn phải thay đổi thông tin trước khi cập nhật',
        'erorr',
        3
      );

      return false;
    }

    if (userAvatar) {
      callUpdateUserAvatar();
    }

    if (!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
  });

  $('#input-btn-cancel-update-user').bind('click', function () {
    userAvatar = null;
    userInfo = {};

    $('#input-change-avatar').val(null);
    $('#user-modal-avatar').attr('src', originAvatar);
    $('#input-change-username').val(originUserInfo.username);
    originUserInfo.gender === 'male'
      ? $('#input-change-gender-male').click()
      : $('#input-change-gender-female').click();
    $('#input-change-address').val(originUserInfo.address);
    $('#input-change-phone').val(originUserInfo.phone);
  });
});
