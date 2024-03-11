const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'MeetingRoom', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  // Add any additional fields you need for booking data
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
