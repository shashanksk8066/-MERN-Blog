// routes/admin/users.js
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const { verifyAdmin } = require('../../middleware/auth');


// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private (admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user by ID (Admin only)
// @access  Private (admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// @route   POST /api/admin/users/promote
// @desc    Promote a user to admin (Admin only)
// @access  Private (admin)
router.post('/promote', verifyAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
