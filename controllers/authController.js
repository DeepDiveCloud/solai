const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model for database interaction

// Generate a JWT token for the user
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    role: user.role,  // Store user role (e.g., 'admin', 'user')
  };

  // If the user is admin, generate a token without expiration
  const options = user.role === 'admin' ? {} : { expiresIn: '1h' }; // No expiration for admins

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Login route handler
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a token (admin tokens won't expire)
  const token = generateToken(user);
  res.json({ token, role: user.role });  // Send back the token and user role
};

module.exports = { login };
