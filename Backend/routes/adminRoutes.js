// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
// Import the new function
const { createEvent, getEventApplicants, exportApplicants } = require('../controllers/adminController');

router.use(protect, isAdmin);

router.post('/events', createEvent);
router.get('/events/:id/applications', getEventApplicants);
router.get('/events/:id/applications/export', exportApplicants); // <-- Add this new route

module.exports = router;