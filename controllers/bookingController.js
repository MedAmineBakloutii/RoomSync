const Booking = require('../models/booking');
const MeetingRoom = require('../models/meetingRoom');

// Controller function to book a meeting room
exports.bookMeetingRoom = async (req, res) => {
  try {
    // Get the meeting room by its ID
    const meetingRoom = await MeetingRoom.findById(req.params.id);
    if (!meetingRoom) {
      return res.status(404).send('Meeting room not found');
    }

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    // Check if the meeting room is available during the requested time slot
    const existingBooking = await Booking.findOne({
      meetingRoom: meetingRoom._id,
      startTime: { $gte: req.body.startTime, $lt: req.body.endTime },
      endTime: { $gt: req.body.startTime, $lte: req.body.endTime },
    });
    if (existingBooking) {
      return res.status(400).send('Meeting room already booked during this time slot');
    }

    // Create a new booking and save it to the database
    const booking = new Booking({
      user: req.user._id,
      meetingRoom: meetingRoom._id,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });
    await booking.save();

    // Add the booking to the meeting room's bookings array
    meetingRoom.bookings = meetingRoom.bookings.concat(booking._id);
    await meetingRoom.save();

    res.status(201).send(booking);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Controller function to cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    // Find the booking by its ID and remove it from the database
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    // Remove the booking from the meeting room's bookings array
    const meetingRoom = await MeetingRoom.findById(booking.meetingRoom);
    if (!meetingRoom) {
      return res.status(404).send('Meeting room not found');
    }
    meetingRoom.bookings = meetingRoom.bookings.filter((bookingId) => bookingId.toString() !== req.params.id);
    await meetingRoom.save();

    res.send(booking);
  } catch (error) {
    res.status(500).send(error.message);
  }
};