import { contactService } from '../services/index';
import { validationResult } from 'express-validator/check';

const findUsersContact = async (req, res) => {
  const errorArray = [];
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = Object.values(validationErrors.mapped());
    errors.forEach((error) => {
      errorArray.push(error.msg);
    });

    return res.status(500).send(errorArray);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let users = await contactService.findUsersContact(currentUserId, keyword);

    return res.render('main/contact/sections/_findUsersContact', { users });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default { findUsersContact };
