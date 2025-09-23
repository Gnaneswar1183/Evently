// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllEvents,
  applyForEvent,
  getMyAppliedEvents,
} = require('../controllers/eventController');

// This route is public for anyone to see the events
router.get('/', getAllEvents);

// These routes are protected
router.get('/my-events', protect, getMyAppliedEvents);
router.post('/:id/apply', protect, applyForEvent);

module.exports = router;