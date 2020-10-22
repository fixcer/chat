import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [{ senderId }, { receiverId }, { type }],
    }).exec();
  },
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: 'add_contact',
};

module.exports = {
  model: mongoose.model('notification', NotificationSchema),
  types: NOTIFICATION_TYPES,
};
