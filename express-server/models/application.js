const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String },
  cvPath: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }
});

module.exports = mongoose.model('Application', applicationSchema);