const mongoose = require("mongoose");
const applicantSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    trim: true,
  },
  applicantId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  authorizedTOWorkInUS: {
    type:Boolean,
    required: true,
  },
  visaSponsorship: {
    type: Boolean,
    required: true,
  },
  Referrer: {
    type: String,
    trim: true,
    required: false,
  },
  resume: {
    type: String,
    trim: true,
    required: true,
  },
  coverLetter: {
    type: String,
    required: false,
  },
  receiveCommunication: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Applicant", applicantSchema);
