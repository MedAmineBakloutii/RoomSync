const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Controller function for user registration
exports.registerUser = async (req, res) => {
    try {
    const { username, password, email } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    const newUser = new User({ username, email, password: await bcrypt.hash(password, 10) });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function for user login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decodedToken.userId;
    next();
  });
};

// Add other user-related controller functions as needed
