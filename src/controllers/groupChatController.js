import { groupChatService } from '../services/index';
import { validationResult } from 'express-validator/check';

const addNewGroup = async (req, res) => {
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
    const currentUserId = req.user._id;
    const memberIds = req.body.ids;
    const groupChatName = req.body.groupChatName;

    const newGroupChat = await groupChatService.addNewGroup(
      currentUserId,
      memberIds,
      groupChatName
    );
    return res.status(200).send({ groupChat: newGroupChat });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export default {
  addNewGroup,
};
