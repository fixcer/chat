import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import passport from 'passport';

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

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({ 'local.email': email }).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  findByToken(token) {
    return this.findOne({ 'local.verifyToken': token }).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      {
        'local.verifyToken': token,
      },
      {
        'local.isActive': true,
        'local.verifyToken': null,
      }
    ).exec();
  },
  findUserById(id) {
    return this.findById(id).exec();
  },
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  },
};

module.exports = mongoose.model('user', UserSchema);
