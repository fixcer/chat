import { check } from 'express-validator/check';
import { transValidation } from '../../lang/vi';

const register = [
  check('email', transValidation.email_incorrect).isEmail().trim(),
  check('gender', transValidation.gender_incorrect).isIn(['male', 'female']),
  check('password', transValidation.password_incorrect)
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
    ),
  check(
    'password_confirmation',
    transValidation.password_confirmation_incorrect
  ).custom((value, { req }) => {
    return value === req.body.password;
  }),
];

module.exports = {
  register,
};
