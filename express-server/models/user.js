const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  likedJobs: { type: Array },
  appliedJobs: { type: Array },
  notifications: { type: Array }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);