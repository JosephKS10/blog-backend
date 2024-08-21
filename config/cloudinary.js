// config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const postImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'post_images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadProfilePicture = multer({ storage: profilePictureStorage });
const uploadPostImage = multer({ storage: postImageStorage });

module.exports = { cloudinary, uploadProfilePicture, uploadPostImage };
