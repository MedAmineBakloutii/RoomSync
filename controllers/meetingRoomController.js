const MeetingRoom = require('../models/meetingRoom');

// Controller function to fetch all meeting rooms
exports.getAllMeetingRooms = async (req, res) => {
    try {
    const meetingRooms = await MeetingRoom.find();
    res.status(200).json(meetingRooms);
    } catch (error) {
    console.error('Error fetching meeting rooms:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
};
