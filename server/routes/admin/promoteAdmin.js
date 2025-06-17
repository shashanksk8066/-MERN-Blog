// server/routes/admin/promoteAdmin.js
const express = require('express');
const User = require('../../models/user');
const router = express.Router();

// Promote a user to admin
router.post('/make-admin/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin ✅', user });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
