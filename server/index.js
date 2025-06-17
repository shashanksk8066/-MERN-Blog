const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const adminRoute = require('./routes/admin/admin.js');




// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');
const commentRoutes = require('./routes/comments');
const adminBlogsRoute = require('./routes/admin/blogs');
const adminLoginRoute = require('./routes/admin/adminLogin');
const promoteAdminRoute = require('./routes/admin/promoteAdmin');
const profileRoute = require('./routes/admin/profile');



// Middleware
app.use(cors());
app.use(express.json()); // ✅ Parse JSON body

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin/users', require('./routes/admin/users'));
app.use('/api/admin', adminRoute);
app.use('/api/admin/blogs', adminBlogsRoute);
app.use('/api/admin', adminLoginRoute);
app.use('/api/admin', promoteAdminRoute);  // For /make-admin/:userId
app.use('/api', profileRoute);             // For /profile



// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });
