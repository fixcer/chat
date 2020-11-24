import axios from 'axios';
import multer from 'multer';
import { app } from '../config/app';
import fsExtra from 'fs-extra';
import { transErrors } from '../../lang/vi';
import { messageService } from '../services/index';
import { validationResult } from 'express-validator/check';
import ejs from 'ejs';
import {
  lastItemOfArray,
  convertTime,
  bufferToBase64,
} from '../helpers/clientHelper';
import { promisify } from 'util';
import request from 'request-promise';
import fs from 'fs';

const renderFile = promisify(ejs.renderFile).bind(ejs);
const requestPromise = promisify(request);

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

  const response = await axios.post(
    'https://fixcer-nsfw.herokuapp.com/filter',
    {
      message: req.body.messageVal,
    }
  );

  if (!response.data.accept) {
    // errorArray.push('Tin nhắn của bạn vi phạm tiêu chuẩn cộng đồng.');
    return res.status(500).send('PROFANITY');
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

const NSFW = async (img) => {
  const options = {
    url: 'https://app.nanonets.com/api/v2/ImageCategorization/LabelFile/',
    formData: {
      modelId: 'e9a7418d-db82-4cc3-bbe1-8c37ad8c77ef',
      file: fs.createReadStream(img),
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from('QHWhmbOmlbzTFLkaXJUPBp96mrXk63Bg' + ':').toString(
          'base64'
        ),
    },
  };

  return await request.post(options);
};

const addNewImage = (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transErrors.image_message_size);
      }

      return res.status(500).send(error);
    }

    let nsfw = await NSFW(req.file.path);
    nsfw = JSON.parse(nsfw).result[0].prediction;
    if (nsfw[1].probability > 0.5 && nsfw[1].label === 'nsfw') {
      return res.status(500).send('Tin nhắn vi phạm quy tắc cộng đồng');
    } else if (nsfw[0].probability > 0.5 && nsfw[0].label === 'nsfw') {
      return res.status(500).send('Tin nhắn vi phạm quy tắc cộng đồng');
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

let storageAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.attachment_message_directory);
  },
  filename: (req, file, callback) => {
    const attachmentName = file.originalname;
    callback(null, attachmentName);
  },
});

let attachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: {
    fileSize: app.attachment_message_limit_size,
  },
}).single('my-attachment-chat');

const addNewFile = (req, res) => {
  attachmentMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transErrors.attachment_message_size);
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

      const newMessage = await messageService.addNewFile(
        sender,
        receiverId,
        messageVal,
        isChatGroup
      );

      await fsExtra.remove(
        `${app.attachment_message_directory}/${newMessage.file.fileName}`
      );

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

const readMoreConversation = async (req, res) => {
  try {
    const skipPersonal = +req.query.skipPersonal;
    const skipGroup = +req.query.skipGroup;

    const allConversation = await messageService.readMoreConversation(
      req.user._id,
      skipPersonal,
      skipGroup
    );

    const dataToRender = {
      allConversation,
      lastItemOfArray,
      convertTime,
      bufferToBase64,
      user: req.user,
    };

    const leftSideData = await renderFile(
      'src/views/main/readMoreConversations/_leftSide.ejs',
      dataToRender
    );
    const rightSideData = await renderFile(
      'src/views/main/readMoreConversations/_rightSide.ejs',
      dataToRender
    );
    const imageModalData = await renderFile(
      'src/views/main/readMoreConversations/_imageModal.ejs',
      dataToRender
    );
    const attachmentModalData = await renderFile(
      'src/views/main/readMoreConversations/_attachmentModal.ejs',
      dataToRender
    );

    return res.status(200).send({
      leftSideData,
      rightSideData,
      imageModalData,
      attachmentModalData,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const readMore = async (req, res) => {
  try {
    const skipMessage = +req.query.skipPersonal;
    const targetId = req.query.targetId;
    const chatInGroup = req.query.chatInGroup === 'true';

    const newMessages = await messageService.readMore(
      req.user._id,
      skipMessage,
      targetId,
      chatInGroup
    );

    const dataToRender = { newMessages, bufferToBase64, user: req.user };

    const rightSideData = await renderFile(
      'src/views/main/readMoreMessages/_rightSide.ejs',
      dataToRender
    );
    const imageModalData = await renderFile(
      'src/views/main/readMoreMessages/_imageModal.ejs',
      dataToRender
    );
    const attachmentModalData = await renderFile(
      'src/views/main/readMoreMessages/_attachmentModal.ejs',
      dataToRender
    );

    return res.status(200).send({
      rightSideData,
      imageModalData,
      attachmentModalData,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default {
  addNewPure,
  addNewImage,
  addNewFile,
  readMoreConversation,
  readMore,
};
