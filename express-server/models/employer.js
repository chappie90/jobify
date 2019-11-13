const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const employerSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  postedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'Job'
      // date: { type: Date, required: true },
    }
  ],
});

employerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Employer', employerSchema);