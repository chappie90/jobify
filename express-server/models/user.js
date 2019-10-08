const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  myJobs: {
    applied: Array,
    saved: Array,
  },
  notifications: Array,
  cvPath: String,
  cvName: String,
  profile: {
    summary: {
      fname: String,
      lname: String,
      country: String,
      address: String,
      number: Number,
      avatarPath: String
    }
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);