const Appointment = require('../models/Appointment');
const User = require('../models/User');

// GET /api/admin/appointments — All appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/appointments/:id/status — Update status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    return res.json({ success: true, appointment: appt });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/appointments/:id — Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndDelete(req.params.id);
    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    return res.json({ success: true, message: 'Appointment deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

// POST /api/admin/appointments — Add walk-in appointment
exports.createWalkInAppointment = async (req, res) => {
  try {
    const { patientName, patientPhone, branch, treatment, appointmentDate, timeSlot, notes } = req.body;

    const targetBranch = branch || 'Kangra Centre';
    const targetDate = appointmentDate || new Date().toLocaleDateString('en-IN');
    const targetSlot = timeSlot || '10:00 AM';

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
          ? `The ${targetSlot} slot at ${targetBranch} on ${targetDate} is already booked.`
          : `The ${targetSlot} slot at ${targetBranch} on ${targetDate} is unavailable because another appointment is booked at ${conflict.timeSlot} (30-minute buffer required).`;

        return res.status(400).json({
          success: false,
          message: reasonMessage
        });
      }
    }

    const appt = await Appointment.create({
      patientName: patientName || 'Walk-in Patient',
      patientPhone: patientPhone || 'N/A',
      branch: targetBranch,
      treatment: treatment || 'General Consultation',
      doctorName: targetBranch && targetBranch.includes('Dharamshala') ? 'Dr. Ananya Katoch' : 'Dr. Ranjan Sharma',
      appointmentDate: targetDate,
      timeSlot: targetSlot,
      status: 'Confirmed',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Walk-in appointment created.',
      appointment: appt
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/stats — Dashboard analytics
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, allAppointments] = await Promise.all([
      User.find({ role: { $ne: 'admin' } }).lean(),
      Appointment.find().lean()
    ]);

    const patientKeys = new Set();
    users.forEach(u => patientKeys.add((u.phone || u.email || String(u._id)).toLowerCase().replace(/\s+/g, '')));
    allAppointments.forEach(a => {
      if (a.patientPhone || a.patientName) {
        patientKeys.add((a.patientPhone || a.patientName).toLowerCase().replace(/\s+/g, ''));
      }
    });

    const totalPatients = patientKeys.size;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const todaysAppointments = allAppointments.filter(a =>
      a.appointmentDate && a.appointmentDate.includes(today)
    );

    const confirmed = allAppointments.filter(a => a.status === 'Confirmed').length;
    const pending = allAppointments.filter(a => a.status === 'Pending').length;
    const completed = allAppointments.filter(a => a.status === 'Completed').length;
    const cancelled = allAppointments.filter(a => a.status === 'Cancelled').length;

    const kangraCount = allAppointments.filter(a => a.branch && a.branch.includes('Kangra')).length;
    const dharamshalaCount = allAppointments.filter(a => a.branch && a.branch.includes('Dharamshala')).length;

    return res.json({
      success: true,
      stats: {
        totalPatients,
        totalAppointments: allAppointments.length,
        todaysAppointments: todaysAppointments.length,
        confirmed,
        pending,
        completed,
        cancelled,
        branches: {
          kangra: kangraCount,
          dharamshala: dharamshalaCount
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
