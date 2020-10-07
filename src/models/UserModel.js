import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  gender: { type: String, default: 'male' },
  phone: { type: Number, default: null },
  address: { type: String, default: 'avatar-default.jpg' },
  role: { type: String, default: 'user' },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uuid: String,
    token: String,
    email: {
      type: String,
      trim: true,
    },
  },
  google: {
    uuid: String,
    token: String,
    email: {
      type: String,
      trim: true,
    },
  },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null },
});

module.exports = mongoose.model('user', UserSchema);
