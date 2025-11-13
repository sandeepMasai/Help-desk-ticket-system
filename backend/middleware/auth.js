const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user has admin role
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user has user role (regular user)
const userAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied. User only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user has specific role(s)
const roleAuth = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied. Required role: ${roles.join(' or ')}`
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// Check if user owns the resource or is admin
const ownerOrAdmin = (resourceUserId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const userId = typeof resourceUserId === 'function'
        ? resourceUserId(req)
        : resourceUserId;

      if (req.user.role === 'admin' || req.user._id.toString() === userId.toString()) {
        return next();
      }

      return res.status(403).json({ message: 'Access denied. You can only access your own resources.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = {
  auth,
  adminAuth,
  userAuth,
  roleAuth,
  ownerOrAdmin
};
