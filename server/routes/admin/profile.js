const express = require('express');
const { verifyUser } = require('../../middleware/auth'); // ✅ fixed path

const router = express.Router();

router.get('/profile', verifyUser, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
