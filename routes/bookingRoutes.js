const express = require('express');
const router = express.Router();
const { bookMeetingRoom, cancelBooking } = require('../controllers/bookingController');
const { authenticateUser } = require('../middlewares/authenticateUser');

// Route to book a meeting room (requires authentication)
router.post('/book', authenticateUser, bookMeetingRoom);

// Route to cancel a booking (requires authentication)
router.delete('/:id', authenticateUser, cancelBooking);

module.exports = router;
