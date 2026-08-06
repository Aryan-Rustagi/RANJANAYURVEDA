const jwt = require('jsonwebtoken');

const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'ranjan_admin_super_secret_key_2026_panel'
      );

      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }

      req.admin = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      };

      return next();
    } catch (error) {
      console.error('Admin JWT Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired admin token. Please login again.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No authentication token provided.'
    });
  }
};

module.exports = { adminProtect };
