const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/user.js');

const router = express.Router();

// @route   POST /api/admin/create
// @desc    Manually create a new admin account
// @access  Private or Initial Setup Only
router.post('/create', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validate all required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: 'admin' // ✅ Explicitly set admin role
    });

    await adminUser.save();

    res.status(201).json({
      message: 'Admin account created successfully',
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
