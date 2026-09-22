const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapyName: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  totalSessions: {
    type: Number,
    default: 5
  },
  completedSessions: {
    type: Number,
    default: 3
  },
  roomNo: {
    type: String,
    default: 'Therapy Room 1'
  },
  therapistName: {
    type: String,
    default: 'Vaidya Mohan'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed'],
    default: 'In Progress'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Therapy', therapySchema);
