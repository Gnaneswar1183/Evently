// models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  appliedAt: { type: Date, default: Date.now },
});

// Ensure a student can apply to an event only once
ApplicationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);