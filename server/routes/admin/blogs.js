const express = require('express');
const { verifyAdmin } = require('../../middleware/auth');
const Post = require('../../models/post'); // using "posts" collection

const router = express.Router();

// @route   GET /api/admin/blogs
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/blogs/:id
// @desc    Get a single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/blogs
// @desc    Create a new blog post
// @access  Admin only
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, image, author, authorName } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required.' });
    }

    const newPost = new Post({
      title,
      excerpt,
      content,
      category,
      tags: tags || [],
      image,
      author: author || req.user._id,
      authorName: authorName || req.user.name,
    });

    await newPost.save();
    res.status(201).json({ message: 'Blog post created successfully', post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/blogs/:id
// @desc    Update an existing blog post
// @access  Admin only
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, tags, image, author, authorName } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.excerpt = excerpt || post.excerpt;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.image = image || post.image;
    post.author = author || post.author;
    post.authorName = authorName || post.authorName;

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete a blog post
// @access  Admin only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
