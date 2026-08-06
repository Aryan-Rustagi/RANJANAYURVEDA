const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract Bearer token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'ranjan_ayurveda_super_secret_jwt_key_2026_estd2005'
      );

      // Try to fetch user from DB (excluding password)
      // Wrapped in its own try-catch so DB errors (e.g. CastError for non-ObjectId IDs) don't reject the request
      if (process.env.MONGODB_URI) {
        try {
          const dbUser = await User.findById(decoded.id).select('-password');
          if (dbUser) {
            req.user = dbUser;
          }
        } catch (dbErr) {
          // decoded.id is not a valid ObjectId (mock/fallback user) — that's fine, use token payload
          console.warn('DB user lookup skipped:', dbErr.message);
        }
      }

      if (!req.user) {
        // Fallback user object from decoded JWT payload
        req.user = {
          id: decoded.id || 'mock-id-101',
          _id: decoded.id || 'mock-id-101',
          name: decoded.name || 'Rajesh Kumar',
          email: decoded.email || 'rajesh.kumar@example.com',
          phone: decoded.phone || '98160 12345',
          role: decoded.role || 'patient',
          patientId: decoded.patientId || 'RAY-2026-892',
          dosha: decoded.dosha || 'Vata-Pitta'
        };
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Token invalid or expired.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. No JWT token provided.'
    });
  }
};

const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'ranjan_ayurveda_super_secret_jwt_key_2026_estd2005'
      );
      if (process.env.MONGODB_URI) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      if (!req.user) {
        req.user = { id: decoded.id, name: decoded.name, role: decoded.role };
      }
    } catch (e) {
      // Ignore token error for optional auth
    }
  }
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user ? req.user.role : 'guest'}' does not have permission.`
      });
    }
    next();
  };
};

module.exports = { protect, optionalProtect, authorize };
