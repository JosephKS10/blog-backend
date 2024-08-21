const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 
const postsRouter = require('./routes/Posts');
const authRouter = require('./routes/Auth'); 
const authMiddleware = require('./middlewares/AuthMiddleware'); 
const commentsRouter = require('./routes/Comments');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
}

// Apply the authentication middleware to the /posts route
app.use('/posts', authMiddleware, postsRouter);
app.use('/comments', authMiddleware, commentsRouter);
app.use('/auth', authRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
