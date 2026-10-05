const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Helper: check if a value is a valid MongoDB ObjectId
const isValidObjectId = (val) =>
  Boolean(val) && mongoose.Types.ObjectId.isValid(val) && String(new mongoose.Types.ObjectId(val)) === String(val);

// Helper: normalize status to PascalCase ('Confirmed', 'Pending', 'Completed', 'Cancelled')
const normalizeStatus = (status, defaultStatus = 'Confirmed') => {
  if (!status || typeof status !== 'string') return defaultStatus;
  const s = status.trim().toLowerCase();
  if (s === 'confirmed') return 'Confirmed';
  if (s === 'pending') return 'Pending';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  return defaultStatus;
};

// Helper: normalize branch to standard name matching schema enum
const normalizeBranch = (branch) => {
  if (!branch || typeof branch !== 'string') return 'Kangra Centre';
  const b = branch.trim().toLowerCase();
  if (b.includes('dharamshala')) return 'Dharamshala Centre';
  return 'Kangra Centre';
};

// Helper: Normalize branch name for conflict comparison
const getBranchKey = (b) => {
  if (!b) return '';
  const str = String(b).toLowerCase();
  if (str.includes('kangra')) return 'kangra';
  if (str.includes('dharamshala')) return 'dharamshala';
  return str.trim();
};

// Helper: Convert time string like "10:00 AM" or "02:30 PM" to minutes from midnight
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const str = String(timeStr).trim();
  const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper: Get alternate date representations to query across formats (YYYY-MM-DD, DD/MM/YYYY, D/M/YYYY)
const getDateVariants = (dateInput) => {
  if (!dateInput) return [];
  const str = String(dateInput).trim();
  const variants = new Set([str]);

  // If ISO YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    variants.add(`${d}/${m}/${y}`);
    variants.add(`${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`);
  }

  // If DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    const padD = d.padStart(2, '0');
    const padM = m.padStart(2, '0');
    variants.add(`${y}-${padM}-${padD}`);
    variants.add(`${padD}/${padM}/${y}`);
  }

  return Array.from(variants);
};

// Helper: check if an appointment date represents "today"
const isTodayAppointment = (dateVal) => {
  if (!dateVal) return false;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const todayISO = `${year}-${month}-${day}`;
  const todayDMY = `${day}/${month}/${year}`;
  const todayShortDMY = `${now.getDate()}/${now.getMonth() + 1}/${year}`;
  const todayUTC = now.toISOString().split('T')[0];

  const matchSet = new Set([todayISO, todayDMY, todayShortDMY, todayUTC]);

  if (dateVal instanceof Date) {
    const dStr = dateVal.toISOString().split('T')[0];
    return matchSet.has(dStr);
  }

  const str = String(dateVal).trim();
  if (matchSet.has(str)) return true;
  for (const candidate of matchSet) {
    if (str.includes(candidate)) return true;
  }
  return false;
};

// GET /api/admin/appointments — All appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
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

// PATCH /api/admin/appointments/:id/status — Update status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide appointment status.' });
    }

    const cleanStatus = normalizeStatus(status);
    const { id } = req.params;

    let appt;
    if (isValidObjectId(id)) {
      appt = await Appointment.findByIdAndUpdate(
        id,
        { status: cleanStatus },
        { new: true, runValidators: true }
      );
    } else {
      appt = await Appointment.findOneAndUpdate(
        { _id: id },
        { status: cleanStatus },
        { new: true, runValidators: true }
      );
    }

    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({ success: true, appointment: appt });
  } catch (error) {
    console.error('updateAppointmentStatus error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/appointments/:id — Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    let appt;

    if (isValidObjectId(id)) {
      appt = await Appointment.findByIdAndDelete(id);
    } else {
      appt = await Appointment.findOneAndDelete({ _id: id });
    }

    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({ success: true, message: 'Appointment deleted.' });
  } catch (error) {
    console.error('deleteAppointment error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/appointments — Add walk-in appointment
exports.createWalkInAppointment = async (req, res) => {
  try {
    const { patientName, patientPhone, branch, treatment, appointmentDate, timeSlot, notes, status } = req.body;

    const now = new Date();
    const defaultToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const targetBranch = normalizeBranch(branch);
    const targetDate = appointmentDate ? String(appointmentDate).trim() : defaultToday;
    const targetSlot = timeSlot ? String(timeSlot).trim() : '10:00 AM';
    const targetStatus = normalizeStatus(status, 'Confirmed');

    // Double-Booking & 30-Minute Buffer Check
    const targetBranchKey = getBranchKey(targetBranch);
    const dateVariants = getDateVariants(targetDate);

    const existingBookings = await Appointment.find({
      appointmentDate: { $in: dateVariants },
      status: { $nin: ['Cancelled', 'cancelled'] }
    }).lean();

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
      patientName: patientName ? String(patientName).trim() : 'Walk-in Patient',
      patientPhone: patientPhone ? String(patientPhone).trim() : 'N/A',
      branch: targetBranch,
      treatment: treatment ? String(treatment).trim() : 'General Consultation',
      doctorName: targetBranch.includes('Dharamshala') ? 'Dr. Ananya Katoch' : 'Dr. Ranjan Sharma',
      appointmentDate: targetDate,
      timeSlot: targetSlot,
      status: targetStatus,
      notes: notes ? String(notes).trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Walk-in appointment created.',
      appointment: appt
    });
  } catch (error) {
    console.error('createWalkInAppointment error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/appointments/stats or /api/admin/stats — Dashboard analytics
exports.getDashboardStats = async (req, res) => {
  try {
    let users = [];
    let allAppointments = [];

    try {
      [users, allAppointments] = await Promise.all([
        User.find({ role: { $ne: 'admin' } }).lean(),
        Appointment.find().sort({ createdAt: -1 }).lean()
      ]);
    } catch (fetchErr) {
      console.warn('Dashboard stats batch fetch warning:', fetchErr.message);
      try { users = await User.find({ role: { $ne: 'admin' } }).lean(); } catch (_) {}
      try { allAppointments = await Appointment.find().lean(); } catch (_) {}
    }

    // Safely collect unique patient identifiers
    const patientKeys = new Set();
    (users || []).forEach(u => {
      const key = String(u.phone || u.email || u._id || '').toLowerCase().replace(/\s+/g, '');
      if (key) patientKeys.add(key);
    });
    (allAppointments || []).forEach(a => {
      const key = String(a.patientPhone || a.patientName || a._id || '').toLowerCase().replace(/\s+/g, '');
      if (key) patientKeys.add(key);
    });

    const totalPatients = patientKeys.size;

    // Filter today's appointments safely across date formats and types
    const todaysAppointments = (allAppointments || []).filter(a => isTodayAppointment(a.appointmentDate));

    // Case-insensitive status aggregations
    const confirmed = (allAppointments || []).filter(a => (a.status || '').toLowerCase() === 'confirmed').length;
    const pending = (allAppointments || []).filter(a => (a.status || '').toLowerCase() === 'pending').length;
    const completed = (allAppointments || []).filter(a => (a.status || '').toLowerCase() === 'completed').length;
    const cancelled = (allAppointments || []).filter(a => (a.status || '').toLowerCase() === 'cancelled' || (a.status || '').toLowerCase() === 'canceled').length;

    const kangraCount = (allAppointments || []).filter(a => a.branch && String(a.branch).toLowerCase().includes('kangra')).length;
    const dharamshalaCount = (allAppointments || []).filter(a => a.branch && String(a.branch).toLowerCase().includes('dharamshala')).length;

    return res.json({
      success: true,
      stats: {
        totalPatients,
        totalAppointments: (allAppointments || []).length,
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
    console.error('getDashboardStats error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
