const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.isAuthenticated = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'Access denied, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Access denied, token invalid' });
  }
};
