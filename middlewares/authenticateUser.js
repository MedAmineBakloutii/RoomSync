const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateUser = (req, res, next) => {
  // Get token from request headers
    const token = req.headers.authorization;
  // Check if token exists
    if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
  // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    // Check if decoded token contains user ID
    if (!decodedToken.userId) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token payload' });
    }
    // Fetch user from database
    User.findById(decodedToken.userId)
        .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }
        // Store user in request object for later use
        req.user = user;
        next(); // Call next middleware or route handler
        })
        .catch(err => {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Internal server error' });
        });
    });
};
