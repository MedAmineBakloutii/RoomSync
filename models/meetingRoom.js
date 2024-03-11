const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingRoomSchema = new Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    facilities: { type: [String], default: [] },
  // Add any additional fields you need for meeting room data
});

const MeetingRoom = mongoose.model('MeetingRoom', meetingRoomSchema);

module.exports = MeetingRoom;

