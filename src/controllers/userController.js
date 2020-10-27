import multer from 'multer';
import { app } from '../config/app';
import { v4 as uuidv4 } from 'uuid';
import { transErrors, transSuccess } from '../../lang/vi';
import { userService } from '../services/index';
import fsExtra from 'fs-extra';
import { validationResult } from 'express-validator/check';

let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
    const match = app.avatar_type;

    if (match.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);
    }

    const avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  },
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {
    fileSize: app.avatar_limit_size,
  },
}).single('avatar');

let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transErrors.avatar_size);
      }

      return res.status(500).send(error);
    }

    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updateAt: Date.now(),
      };

      let userUpdate = await userService.updateUser(
        req.user._id,
        updateUserItem
      );

      //Remove old user avatar
      // await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);

      let response = {
        message: transSuccess.user_info_updated,
        imageSrc: `/images/users/${req.file.filename}`,
      };
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let updateInfo = async (req, res) => {
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
    let updateUserItem = req.body;
    await userService.updateUser(req.user._id, updateUserItem);

    let response = {
      message: transSuccess.user_info_updated,
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let updatePassword = async (req, res) => {
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
    let updateUserItem = req.body;

    await userService.updatePassword(req.user._id, updateUserItem);

    let response = {
      message: transSuccess.user_password_updated,
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default {
  updateAvatar,
  updateInfo,
  updatePassword,
};
