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
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo. Vui lòng kiểm tra email để kích hoạt tài khoản`;
  },
};
