const express = require('express');
const router = express.Router();
const { getAllMeetingRooms } = require('../controllers/meetingRoomController');

// Route to fetch all meeting rooms
router.get('/', getAllMeetingRooms);

module.exports = router;
