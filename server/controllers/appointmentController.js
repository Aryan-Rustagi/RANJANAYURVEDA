const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// Helper: check if a value is a valid MongoDB ObjectId
const isValidObjectId = (val) => mongoose.Types.ObjectId.isValid(val) && String(new mongoose.Types.ObjectId(val)) === String(val);

// @desc    Get appointments for logged-in user
// @route   GET /api/appointments/my
// @access  Private (Patient)
exports.getMyAppointments = async (req, res) => {
  try {
    let appointments = [];

    // Determine patient identifier — could be ObjectId or fallback string
    const userId = req.user._id || req.user.id;

    if (isValidObjectId(userId)) {
      // Query by ObjectId reference
      appointments = await Appointment.find({ patient: userId }).sort({ createdAt: -1 });
    } else {
      // Fallback: query by patientName or patientPhone for non-ObjectId users
      const orConditions = [];
      if (req.user.name) orConditions.push({ patientName: req.user.name });
      if (req.user.phone) orConditions.push({ patientPhone: req.user.phone });
      if (req.user.email) orConditions.push({ patientPhone: req.user.email });

      if (orConditions.length > 0) {
        appointments = await Appointment.find({ $or: orConditions }).sort({ createdAt: -1 });
      }
    }

    return res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('getMyAppointments error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book a new appointment (Enforces Slot Double-Booking Prevention)
// @route   POST /api/appointments
// Helper: Convert time string like "10:00 AM" or "02:30 PM" to minutes from midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper: Normalize branch name for comparison
const getBranchKey = (b) => {
  if (!b) return '';
  if (b.toLowerCase().includes('kangra')) return 'kangra';
  if (b.toLowerCase().includes('dharamshala')) return 'dharamshala';
  return b.toLowerCase().trim();
};

// @access  Private / Guest
exports.createAppointment = async (req, res) => {
  try {
    const { treatment, branch, appointmentDate, timeSlot, notes, patientName, patientPhone } = req.body;

    const targetBranch = branch || 'Kangra Centre';
    const targetDate = appointmentDate;
    const targetSlot = timeSlot || '10:00 AM';

    if (!targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Please select a preferred date.'
      });
    }

    // Double-Booking & 30-Minute Buffer Check
    const targetBranchKey = getBranchKey(targetBranch);
    const existingBookings = await Appointment.find({
      appointmentDate: targetDate,
      status: { $ne: 'Cancelled' }
    });

    const targetMinutes = parseTimeToMinutes(targetSlot);

    if (targetMinutes !== null) {
      const conflict = existingBookings.find(appt => {
        if (getBranchKey(appt.branch) !== targetBranchKey) return false;
        const apptMinutes = parseTimeToMinutes(appt.timeSlot);
        if (apptMinutes === null) return false;
        return Math.abs(targetMinutes - apptMinutes) <= 30;
      });

      if (conflict) {
        const conflictMinutes = parseTimeToMinutes(conflict.timeSlot);
        const timeDiff = Math.abs(targetMinutes - conflictMinutes);
        const reasonMessage = timeDiff === 0
          ? `The ${targetSlot} slot at ${targetBranch} on ${targetDate} is already booked by another patient.`
          : `The ${targetSlot} slot at ${targetBranch} on ${targetDate} is unavailable because another appointment is booked at ${conflict.timeSlot} (a 30-minute buffer is required between appointments).`;

        return res.status(400).json({
          success: false,
          message: `${reasonMessage} Please select a time slot at least 30 minutes apart.`
        });
      }
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;
    const name = patientName || (req.user ? req.user.name : 'Walk-in Patient');
    const phone = patientPhone || (req.user ? req.user.phone : '98160 12345');

    const appointmentData = {
      patientName: name,
      patientPhone: phone,
      branch: targetBranch,
      treatment: treatment || 'Spine Consultation',
      doctorName: targetBranch && targetBranch.includes('Dharamshala') ? 'Dr. Ananya Katoch' : 'Dr. Ranjan Sharma',
      appointmentDate: targetDate,
      timeSlot: targetSlot,
      status: 'Confirmed',
      notes: notes || ''
    };

    // Only set the patient ObjectId reference if it's a valid ObjectId
    if (userId && isValidObjectId(userId)) {
      appointmentData.patient = userId;
    }

    const appt = await Appointment.create(appointmentData);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: appt
    });
  } catch (error) {
    console.error('createAppointment error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments (Admin/Doctor)
// @route   GET /api/appointments
// @access  Private (Admin/Doctor)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('getAllAppointments error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private (Admin/Doctor)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    return res.json({ success: true, appointment: appt });
  } catch (error) {
    console.error('updateAppointmentStatus error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete/Cancel an appointment (Customer / Patient)
// @route   DELETE /api/appointments/:id
// @access  Private (Patient / Guest)
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      await Appointment.findByIdAndDelete(id);
    } else {
      await Appointment.deleteOne({ _id: id });
    }
    return res.json({
      success: true,
      message: 'Appointment cancelled and removed successfully.'
    });
  } catch (error) {
    console.warn('deleteAppointment notice:', error.message);
    return res.json({
      success: true,
      message: 'Appointment removed.'
    });
  }
};
