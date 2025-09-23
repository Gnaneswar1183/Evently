// controllers/eventController.js
const Event = require('../models/Event');
const Application = require('../models/Application');

// @desc    Fetch all events
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by upcoming
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Apply for an event
// @route   POST /api/events/:id/apply
exports.applyForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      eventId: req.params.id,
      studentId: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'Already applied for this event' });
    }

    const newApplication = new Application({
      eventId: req.params.id,
      studentId: req.user.id,
    });

    await newApplication.save();
    res.status(201).json({ msg: 'Successfully applied for the event' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get events a student has applied for
// @route   GET /api/events/my-events
exports.getMyAppliedEvents = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id }).populate('eventId');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};