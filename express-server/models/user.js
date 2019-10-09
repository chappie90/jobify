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
  notifications: [
    {
      date: { type: Date, required: true },
      type: { type: String, required: true },
      notification: { type: String, required: true },
      status: { type: Boolean, required: true } 
    }
  ],
  cvPath: String,
  cvName: String,
  profile: {
    summary: {
      fname: String,
      lname: String,
      headline: String,
      country: String,
      city: String,
      number: Number,
      avatarPath: String
    }
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);