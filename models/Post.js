const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Body: {
    type: String,
    required: true
  },
  Category: {
    type: String,
    required: true
  },
  PostDate: {
    type: Date,
    default: Date.now
  },
  ReadTime: {
    type: Number,
    required: true
  },
  Excerpt: {
    type: String,
    required: true
  },
  Tags: [String],
  AuthorName: {
    type: String,
    required: true
  },
  AuthorID: {
    type: mongoose.Schema.Types.ObjectId, // Store the user's _id
    required: true,
    ref: 'User' // Reference to the User model
  },
  AuthorImageURL: {
    type: String,
    required: true
  },
  FeaturedImageURL: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Post', PostSchema);
