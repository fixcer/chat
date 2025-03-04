import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeContact(userId, contactId) {
    return this.deleteMany({
      $or: [
        {
          $and: [{ userId }, { contactId }, { status: true }],
        },
        {
          $and: [
            { userId: contactId },
            { contactId: userId },
            { status: true },
          ],
        },
      ],
    }).exec();
  },
  findAllByUser(userId) {
    return this.find({
      $or: [{ userId: userId }, { contactId: userId }],
    }).exec();
  },
  checkExist(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] },
      ],
    }).exec();
  },
  removeRequestContactSent(userId, contactId) {
    return this.deleteMany({
      $and: [{ userId: userId }, { contactId: contactId }, { status: false }],
    }).exec();
  },
  approveRequestContactReceived(userId, contactId) {
    return this.updateOne(
      {
        $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
      },
      { status: true, updateAt: Date.now() }
    ).exec();
  },
  removeRequestContactReceived(userId, contactId) {
    return this.deleteMany({
      $and: [{ userId: contactId }, { contactId: userId }, { status: false }],
    }).exec();
  },
  getContacts(userId, limit) {
    return this.find({
      $and: [{ $or: [{ userId }, { contactId: userId }] }, { status: true }],
    })
      .sort({ updateAt: -1 })
      .limit(limit)
      .exec();
  },
  getContactsSent(userId, limit) {
    return this.find({
      $and: [{ userId }, { status: false }],
    })
      .sort({ createAt: -1 })
      .limit(limit)
      .exec();
  },
  getContactsReceived(contactId, limit) {
    return this.find({
      $and: [{ contactId }, { status: false }],
    })
      .sort({ createAt: -1 })
      .limit(limit)
      .exec();
  },
  countContacts(userId) {
    return this.countDocuments({
      $and: [{ $or: [{ userId }, { contactId: userId }] }, { status: true }],
    }).exec();
  },
  countContactsSent(userId) {
    return this.countDocuments({
      $and: [{ userId }, { status: false }],
    }).exec();
  },
  countContactsReceived(userId) {
    return this.countDocuments({
      $and: [{ contactId: userId }, { status: false }],
    }).exec();
  },
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [{ $or: [{ userId }, { contactId: userId }] }, { status: true }],
    })
      .sort({ updateAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [{ userId }, { status: false }],
    })
      .sort({ createAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  readMoreContactsReceived(contactId, skip, limit) {
    return this.find({
      $and: [{ contactId }, { status: false }],
    })
      .sort({ createAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  updateWhenHasNewMessage(userId, contactId) {
    return this.updateMany(
      {
        $or: [
          { $and: [{ userId: userId }, { contactId: contactId }] },
          { $and: [{ userId: contactId }, { contactId: userId }] },
        ],
      },
      {
        updateAt: Date.now(),
      }
    ).exec();
  },
  getFriends(userId) {
    return this.find({
      $and: [{ $or: [{ userId }, { contactId: userId }] }, { status: true }],
    })
      .sort({ updateAt: -1 })
      .exec();
  },
};

module.exports = mongoose.model('contact', ContactSchema);
