import { messageService } from '../services/index';
import { validationResult } from 'express-validator/check';

const addNewPure = async (req, res) => {
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
    const sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar,
    };
    const receiverId = req.body.uid;
    const messageVal = req.body.messageVal;
    const isChatGroup = req.body.isChatGroup;

    const newMessage = await messageService.addNewPure(
      sender,
      receiverId,
      messageVal,
      isChatGroup
    );

    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default {
  addNewPure,
};
