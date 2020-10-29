import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String,
  },
  receiver: {
    id: String,
    name: String,
    avatar: String,
  },
  text: String,
  file: { data: Buffer, contentType: String, fileName: String },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});

MessageSchema.statics = {
  addNew(item) {
    return this.create(item);
  },
  getMessagesInPersonal(senderId, receiverId, limit) {
    return this.find({
      $or: [
        { $and: [{ senderId }, { receiverId }] },
        { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
      ],
    })
      .sort({ createAt: -1 })
      .limit(limit)
      .exec();
  },
  getMessagesInGroup(receiverId, limit) {
    return this.find({ receiverId }).sort({ createAt: -1 }).limit(limit).exec();
  },
};

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: 'personal',
  GROUP: 'group',
};

const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
};

module.exports = {
  model: mongoose.model('message', MessageSchema),
  conversationType: MESSAGE_CONVERSATION_TYPES,
  messageType: MESSAGE_TYPES,
};
