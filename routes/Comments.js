const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new comment to a post
router.post('/:postId', async (req, res) => {
  const { userName, userProfilePic, text } = req.body;

  const comment = new Comment({
    postId: req.params.postId,
    userName,
    userProfilePic,
    text,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
