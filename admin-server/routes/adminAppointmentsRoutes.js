const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  createWalkInAppointment,
  getDashboardStats
} = require('../controllers/adminAppointmentsController');
const { adminProtect } = require('../middleware/adminAuth');

router.get('/stats', adminProtect, getDashboardStats);
router.get('/', adminProtect, getAllAppointments);
router.post('/', adminProtect, createWalkInAppointment);
router.patch('/:id/status', adminProtect, updateAppointmentStatus);
router.delete('/:id', adminProtect, deleteAppointment);

module.exports = router;
