const express = require('express');
const router = express.Router();
const { 
  getMyAppointments, 
  createAppointment, 
  getAllAppointments, 
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyAppointments);
router.post('/', optionalProtect, createAppointment);
router.get('/', optionalProtect, getAllAppointments);
router.patch('/:id/status', optionalProtect, updateAppointmentStatus);
router.delete('/:id', optionalProtect, deleteAppointment);

module.exports = router;
