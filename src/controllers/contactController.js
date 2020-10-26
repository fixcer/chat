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

const addNew = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contactService.addNew(currentUserId, contactId);

    return res.status(200).send({ success: !!newContact });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const removeRequestContactSent = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removed = await contactService.removeRequestContactSent(
      currentUserId,
      contactId
    );

    return res.status(200).send({ success: !!removed });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const removeRequestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removed = await contactService.removeRequestContactReceived(
      currentUserId,
      contactId
    );

    return res.status(200).send({ success: !!removed });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const approveRequestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let approved = await contactService.approveRequestContactReceived(
      currentUserId,
      contactId
    );

    return res.status(200).send({ success: !!approved });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMoreContacts = async (req, res) => {
  try {
    const skipNumberContacts = +req.query.skipNumber;
    const contacts = await contactService.readMoreContacts(
      req.user._id,
      skipNumberContacts
    );
    return res.status(200).send(contacts);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMoreContactsSent = async (req, res) => {
  try {
    const skipNumberContacts = +req.query.skipNumber;
    const contacts = await contactService.readMoreContactsSent(
      req.user._id,
      skipNumberContacts
    );
    return res.status(200).send(contacts);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMoreContactsReceived = async (req, res) => {
  try {
    const skipNumberContacts = +req.query.skipNumber;
    const contacts = await contactService.readMoreContactsReceived(
      req.user._id,
      skipNumberContacts
    );
    return res.status(200).send(contacts);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default {
  findUsersContact,
  addNew,
  removeRequestContactSent,
  approveRequestContactReceived,
  removeRequestContactReceived,
  readMoreContacts,
  readMoreContactsSent,
  readMoreContactsReceived,
};
