const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hardcoded admin credentials (in production, store in DB)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'admin@ranjanayurveda.com',
  password: 'admin123',
  name: 'Dr. Ranjan Sharma',
  role: 'admin'
};

const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id || 'admin_001',
      email: admin.email,
      name: admin.name,
      role: 'admin'
    },
    process.env.JWT_SECRET || 'ranjan_admin_super_secret_key_2026_panel',
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
  );
};

// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password.'
      });
    }

    const input = username.toLowerCase().trim();

    if (
      (input === ADMIN_CREDENTIALS.username || input === ADMIN_CREDENTIALS.email) &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const token = generateAdminToken(ADMIN_CREDENTIALS);

      return res.json({
        success: true,
        message: 'Admin login successful.',
        token,
        admin: {
          id: 'admin_001',
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          role: 'admin'
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid admin credentials.'
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/me
exports.getAdminProfile = async (req, res) => {
  return res.json({
    success: true,
    admin: req.admin
  });
};
