const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role/Position is required'],
    trim: true,
  },
  location: {
    type: String,
    default: 'Remote',
    trim: true,
  },
  status: {
    type: String,
    enum: ['Wishlist', 'Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
    default: 'Applied',
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    default: null,
  },
  followUpDate: {
    type: Date,
    default: null,
  },
  jobUrl: {
    type: String,
    trim: true,
    default: '',
  },
  salary: {
    type: String,
    default: '',
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid', 'On-site'],
    default: 'Full-time',
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    default: '',
  },
  contacts: [
    {
      name: String,
      email: String,
      linkedin: String,
      role: String,
    },
  ],
  tags: [{ type: String, trim: true }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  resumeVersion: {
    type: String,
    default: '',
  },
  coverLetterUsed: {
    type: Boolean,
    default: false,
  },
  referral: {
    type: Boolean,
    default: false,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

applicationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for fast querying
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, applicationDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);
