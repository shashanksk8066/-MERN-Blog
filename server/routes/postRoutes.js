const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const verifyToken = require('../middleware/verifyToken');
const authenticateUser = require('../middleware/authMiddleware');


// Create Post ✅
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, image } = req.body;

    const newPost = new Post({
      title,
      content,
      excerpt,
      category,
      tags,
      image,
      author: req.user._id, // ✅ use logged-in user's ID
      authorName: req.user.username, // ✅ optional: display name
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.warn('Create Post Error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});


// Get All Posts ✅
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // optional: newest first
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Get Single Post ✅
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving post' });
  }
});

// Update Post ✅
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not allowed to update this post' });

    const {
      title,
      excerpt,
      content,
      image,
      category,
      tags,
      readTime
    } = req.body;

    post.title = title || post.title;
    post.excerpt = excerpt || post.excerpt;
    post.content = content || post.content;
    post.image = image || post.image;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.readTime = readTime || post.readTime;

    await post.save();

    res.json({ message: 'Post updated successfully ✅', post });
  } catch (err) {
    res.status(500).json({ message: 'Update failed ❌' });
  }
});

// Delete Post ✅
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not allowed to delete this post' });

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully ✅' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed ❌' });
  }
});

module.exports = router;
