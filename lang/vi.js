export const transValidation = {
  email_incorrect: 'Định dạng email không hợp lệ',
  gender_incorrect: 'Just for fun!!',
  password_incorrect:
    'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt',
  password_confirmation_incorrect: 'Hai mật khẩu phải trùng khớp',
};

export const transErrors = {
  email_in_use: 'Email đã được sử dụng',
  account_removed: 'Tài khoản đã bị xóa',
  account_not_active: 'Tài khoản chưa được kích hoạt',
  token_undefined: 'Token không tồn tại',
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo. Vui lòng kiểm tra email để kích hoạt tài khoản`;
  },
  account_active: 'Kích hoạt tài khoản thành công.',
};

export const transEmail = {
  subject: 'Fixcer Chat: Xác nhận kích hoạt tài khoản',
  template: (linkVerify) => {
    return `
      <h2>Vui lòng click vào link bên dưới để kích hoạt tài khoản của bạn.</h2>
      <h3><a href='${linkVerify}' target='_blank'>Verify</a></h3>
      <h4>Trận trọng.</h4>
      `;
  },
  send_failed:
    'Có lỗi trong quá trình gửi email kích hoạt tài khoản, vui lòng thử lại sau.',
};
