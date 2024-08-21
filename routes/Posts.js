const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { uploadPostImage } = require('../config/cloudinary');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware'); 
const mongoose = require('mongoose');


// Middleware to handle image upload
const uploadSingleImage = uploadPostImage.single('featuredImage');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId; 
    console.log(req.userId);
    next();
  });
};

// GET /posts - list all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /posts/:id - get a specific post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// POST /posts - create a new post
router.post(
  '/',
  verifyToken,
  uploadSingleImage,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('body').notEmpty().withMessage('Body is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('readTime').isNumeric().withMessage('ReadTime must be a number'),
    body('excerpt').notEmpty().withMessage('Excerpt is required'),
    body('authorName').notEmpty().withMessage('Author name is required'),
    body('authorImageURL').isURL().withMessage('Author Image URL must be a valid URL')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    

    const featuredImageURL = req.file ? req.file.path : null;

    const post = new Post({
      Title: req.body.title,
      Body: req.body.body,
      Category: req.body.category,
      PostDate: req.body.postDate || Date.now(),
      ReadTime: req.body.readTime,
      Excerpt: req.body.excerpt,
      Tags: req.body.tags,
      AuthorName: req.body.authorName,
      AuthorID: req.userId, 
      AuthorImageURL: req.body.authorImageURL,
      FeaturedImageURL: featuredImageURL
    });

    try {
      const newPost = await post.save();
      res.status(201).json(newPost);
    } catch (err) {
      console.log("error: ", err);
      res.status(400).json({ message: err.message });
    }
  }
);

// PUT /posts/:id - update a post
router.put(
  '/:id',
  uploadSingleImage,
  [
    body('title').optional().notEmpty().withMessage('Title must not be empty'),
    body('body').optional().notEmpty().withMessage('Body must not be empty'),
    body('category').optional().notEmpty().withMessage('Category must not be empty'),
    body('postDate').optional().isISO8601().withMessage('Post Date must be a valid date'),
    body('readTime').optional().isNumeric().withMessage('Read Time must be a number'),
    body('excerpt').optional().notEmpty().withMessage('Excerpt must not be empty'),
    body('tags').optional().isString().withMessage('Tags must be a string'),
    body('authorName').optional().notEmpty().withMessage('Author Name must not be empty'),
    body('authorImageURL').optional().isURL().withMessage('Author Image URL must be a valid URL'),
    body('featuredImageURL').optional().isURL().withMessage('Featured Image URL must be a valid URL')
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      // Update the post fields
      post.Title = req.body.title || post.Title;
      post.Body = req.body.body || post.Body;
      post.Category = req.body.category || post.Category;
      post.PostDate = req.body.postDate || post.PostDate;
      post.ReadTime = req.body.readTime || post.ReadTime;
      post.Excerpt = req.body.excerpt || post.Excerpt;
      post.Tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : post.Tags;
      post.AuthorName = req.body.authorName || post.AuthorName;
      post.AuthorImageURL = req.body.authorImageURL || post.AuthorImageURL;
      post.FeaturedImageURL = req.file ? req.file.path : post.FeaturedImageURL;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// DELETE /posts/:id - delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/blogs/user', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userId = new mongoose.Types.ObjectId(req.userId);
    console.log("Fetching posts for user ID:", userId); // Debug log
    const posts = await Post.find({ AuthorID: userId });
    res.json(posts);
  } catch (err) {
    console.log("Error fetching posts:", err); // Debug log
    res.status(500).json({ message: err.message });
  }
});






module.exports = router;
