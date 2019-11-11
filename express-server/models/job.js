const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  // company: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer' },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  industry: { type: String },
  datePosted: { type: String, required: true },
  overview: { type: String, required: true },
  responsible: { type: String },
  qualify: { type: String }
});

module.exports = mongoose.model('Job', jobSchema);