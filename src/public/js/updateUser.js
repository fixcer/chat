let userAvatar = null;
let userInfo = {};
let originAvatar = null;
let originUserInfo = {};
let userUpdatePassword = {};

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
      /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
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
    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);

    if (!regexPhone.test(phone)) {
      alertify.notify('Số điện thoại không hợp lệ', 'error', 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = phone;
  });
  $('#input-change-current-password').bind('change', function () {
    let currentPassword = $(this).val();
    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    );

    if (!regexPassword.test(currentPassword)) {
      alertify.notify(
        'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt',
        'error',
        7
      );
      $(this).val(null);
      delete userUpdatePassword.currentPassword;
      return false;
    }
    userUpdatePassword.currentPassword = currentPassword;
  });
  $('#input-change-new-password').bind('change', function () {
    let newPassword = $(this).val();
    let regexPassword = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    );

    if (!regexPassword.test(newPassword)) {
      alertify.notify(
        'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt',
        'error',
        7
      );
      $(this).val(null);
      delete userUpdatePassword.newPassword;
      return false;
    }
    userUpdatePassword.newPassword = newPassword;
  });
  $('#input-change-confirm-new-password').bind('change', function () {
    let confirmNewPassword = $(this).val();

    if (!userUpdatePassword.newPassword) {
      alertify.notify('Bạn cần phải nhập mật khẩu mới trước', 'error', 7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }

    if (confirmNewPassword !== userUpdatePassword.newPassword) {
      alertify.notify('Nhập lại mật khẩu chưa chính xác', 'error', 7);
      $(this).val(null);
      $('#input-change-new-password').val(null);
      delete userUpdatePassword.confirmNewPassword;
      delete userUpdatePassword.newPassword;
      return false;
    }

    userUpdatePassword.confirmNewPassword = confirmNewPassword;
  });
}

function callLogout() {
  let timeInterval;
  Swal.fire({
    position: 'top-end',
    title: 'Tự động đăng xuất sau 5 giây.',
    html: 'Thời gian: <strong></strong>',
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timeInterval = setInterval(() => {
        Swal.getContent().querySelector('strong').textContent = Math.ceil(
          Swal.getTimerLeft() / 1000
        );
      }, 1000);
    },
    onClose: () => {
      clearInterval(timeInterval);
    },
  }).then((result) => {
    $.get('/logout', function () {
      location.reload();
    });
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

function callUpdateUserPassword() {
  $.ajax({
    url: '/user/update-password',
    type: 'put',
    data: userUpdatePassword,
    success: function (response) {
      $('.user-modal-password-alert-success')
        .find('span')
        .text(response.message);
      $('.user-modal-password-alert-success').css('display', 'block');

      // Reset all
      $('#input-btn-cancel-update-user-password').click();

      // Logout after change password
      callLogout();
    },
    error: function (error) {
      $('.user-modal-password-alert-error')
        .find('span')
        .text(error.responseText);
      $('.user-modal-password-alert-error').css('display', 'block');

      // Reset all if server response error
      $('#input-btn-cancel-update-user-password').click();
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

  $('#input-btn-update-user-password').bind('click', function () {
    if (
      !userUpdatePassword.currentPassword ||
      !userUpdatePassword.newPassword ||
      !userUpdatePassword.confirmNewPassword
    ) {
      alertify.notify('Bạn phải điền đầy đủ thông tin', 'error', 7);
      return false;
    }

    Swal.fire({
      title: 'Bạn có chắc muốn đổi mật khẩu?',
      text: 'Hành động này không thể hoàn tác.',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Vâng, tôi chắc chắn',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (!result.value) {
        $('#input-btn-cancel-update-user-password').click();
        return false;
      }

      callUpdateUserPassword();
    });
  });

  $('#input-btn-cancel-update-user-password').bind('click', function () {
    userUpdatePassword = {};
    $('#input-change-current-password').val(null);
    $('#input-change-new-password').val(null);
    $('#input-change-confirm-new-password').val(null);
  });
});
