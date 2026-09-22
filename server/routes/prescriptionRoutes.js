const express = require('express');
const router = express.Router();
const { getMyPrescriptions, requestRefill } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyPrescriptions);
router.post('/refill', protect, requestRefill);

module.exports = router;
