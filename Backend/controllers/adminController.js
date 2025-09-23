// controllers/adminController.js
const Event = require('../models/Event');
const Application = require('../models/Application');
const { Parser } = require('json2csv'); // <-- Import the Parser

// @desc    Create a new event
// @route   POST /api/admin/events
exports.createEvent = async (req, res) => {
  const { title, description, date, venue, maxSeats } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      maxSeats,
      createdBy: req.user.id, // Comes from the protect middleware
    });

    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all applicants for a specific event
// @route   GET /api/admin/events/:id/applications
exports.getEventApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ eventId: req.params.id }).populate(
      'studentId',
      'name email'
    );
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



// ... (keep your existing createEvent and getEventApplicants functions) ...

// @desc    Export applicants for an event to CSV
// @route   GET /api/admin/events/:id/applications/export
exports.exportApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ eventId: req.params.id }).populate(
      'studentId',
      'name email'
    );

    if (applications.length === 0) {
      return res.status(404).json({ msg: 'No applicants found for this event.' });
    }

    // We only want the student data, not the full application object
    const applicantsData = applications.map(app => ({
        name: app.studentId.name,
        email: app.studentId.email,
        appliedAt: new Date(app.appliedAt).toLocaleString(),
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(applicantsData);

    res.header('Content-Type', 'text/csv');
    res.attachment('applicants.csv'); // Sets the filename for download
    res.status(200).send(csv);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};