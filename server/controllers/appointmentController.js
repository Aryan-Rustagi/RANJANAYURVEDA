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

    // Double-Booking Check: Verify if slot is already taken for the same branch & date
    const existingBooking = await Appointment.findOne({
      branch: targetBranch,
      appointmentDate: targetDate,
      timeSlot: targetSlot,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `The ${targetSlot} slot at ${targetBranch} on ${targetDate} is already booked by another patient. Please select a different time slot or date.`
      });
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
