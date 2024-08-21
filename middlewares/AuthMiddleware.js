const authMiddleware = (req, res, next) => {
  const jwt = require('jsonwebtoken');

  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: 'Access denied, token missing' });

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
