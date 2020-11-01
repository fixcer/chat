import { check } from 'express-validator/check';
import { transValidation } from '../../lang/vi';

const addNewGroup = [
  check('ids', transValidation.group_chat_users_incorrect).custom((value) => {
    if (!Array.isArray(value)) {
      return false;
    }

    if (value.length < 2) {
      return false;
    }

    return true;
  }),
  check('groupChatName', transValidation.group_chat_name_incorrect)
    .isLength({ min: 3, max: 64 })
    .matches(
      /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
    ),
];

module.exports = {
  addNewGroup,
};
