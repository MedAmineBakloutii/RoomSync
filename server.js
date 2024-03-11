const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Routes
const authRoutes = require('./routes/authRoutes');
const meetingRoomRoutes = require('./routes/meetingRoomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/meeting-rooms', meetingRoomRoutes); // Meeting room routes
app.use('/api/bookings', bookingRoutes); // Booking routes

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI) 
    .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
