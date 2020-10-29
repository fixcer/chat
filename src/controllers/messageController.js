import multer from 'multer';
import { app } from '../config/app';
import fsExtra from 'fs-extra';
import { transErrors } from '../../lang/vi';
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

let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
    const match = app.image_message_type;

    if (match.indexOf(file.mimetype) === -1) {
      return callback(transErrors.image_message_type, null);
    }

    const imageName = file.originalname;
    callback(null, imageName);
  },
});

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: {
    fileSize: app.image_message_limit_size,
  },
}).single('my-image-chat');

const addNewImage = (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transErrors.image_message_size);
      }

      return res.status(500).send(error);
    }

    try {
      const sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };
      const receiverId = req.body.uid;
      const messageVal = req.file;
      const isChatGroup = req.body.isChatGroup;

      const newMessage = await messageService.addNewImage(
        sender,
        receiverId,
        messageVal,
        isChatGroup
      );

      await fsExtra.remove(
        `${app.image_message_directory}/${newMessage.file.fileName}`
      );

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

export default {
  addNewPure,
  addNewImage,
};
