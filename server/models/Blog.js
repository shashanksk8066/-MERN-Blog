const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Quill.js rich text
    category: { type: String, required: true },
    tags: [{ type: String }],
    thumbnail: { type: String }, // Optional: URL for blog thumbnail image
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Set true if authoring is enforced
    },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 }, // Optional analytics field
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
