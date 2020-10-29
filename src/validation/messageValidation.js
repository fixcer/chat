import { check } from 'express-validator/check';
import { transValidation } from '../../lang/vi';

const sendMessage = [
  check('messageVal', transValidation.message_length).isLength({
    min: 1,
    max: 400,
  }),
];

module.exports = {
  sendMessage,
};
