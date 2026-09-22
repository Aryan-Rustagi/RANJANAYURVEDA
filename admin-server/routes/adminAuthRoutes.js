const express = require('express');
const router = express.Router();
const { adminLogin, getAdminProfile } = require('../controllers/adminAuthController');
const { adminProtect } = require('../middleware/adminAuth');

router.post('/login', adminLogin);
router.get('/me', adminProtect, getAdminProfile);

module.exports = router;
