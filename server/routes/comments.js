const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const protect = require('../middleware/authMiddleware'); // ✅ Import the middleware

// Get all comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Add a new comment to a post — ✅ protect this route
router.post('/:postId', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const author = req.user.username;
    const authorAvatar = req.user.avatar || '';

    const newComment = new Comment({
      postId,
      content,
      author,
      authorAvatar,
    });

    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

module.exports = router;
