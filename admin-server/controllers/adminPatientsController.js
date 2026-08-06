const User = require('../models/User');
const Appointment = require('../models/Appointment');

// GET /api/admin/patients — List all patients (Registered users + Appointment patients)
exports.getAllPatients = async (req, res) => {
  try {
    // 1. Fetch registered non-admin users from MongoDB
    let registeredUsers = [];
    try {
      registeredUsers = await User.find({ role: { $ne: 'admin' } })
        .select('-password')
        .sort({ createdAt: -1 })
        .lean();
    } catch (e) {
      console.warn('User find notice:', e.message);
    }

    // 2. Fetch all appointments to extract any walk-in / guest patients
    let appointments = [];
    try {
      appointments = await Appointment.find().sort({ createdAt: -1 }).lean();
    } catch (e) {
      console.warn('Appointment find notice:', e.message);
    }

    // Create a map to deduplicate patients by phone or email or ID
    const patientMap = new Map();

    // First, add registered users
    for (const u of registeredUsers) {
      const key = (u.phone || u.email || String(u._id)).toLowerCase().replace(/\s+/g, '');
      patientMap.set(key, {
        _id: u._id,
        patientId: u.patientId || ('RAY-2026-' + Math.floor(100 + Math.random() * 900)),
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        dosha: u.dosha || 'Vata-Pitta',
        preferredBranch: u.preferredBranch || 'Kangra Centre',
        primaryCondition: u.primaryCondition || 'General Consultation',
        createdAt: u.createdAt || new Date()
      });
    }

    // Second, add any appointment patients not yet in registered users
    for (const appt of appointments) {
      const pName = appt.patientName;
      const pPhone = appt.patientPhone;
      if (!pName) continue;

      const key = (pPhone || pName).toLowerCase().replace(/\s+/g, '');
      if (!patientMap.has(key)) {
        patientMap.set(key, {
          _id: appt._id,
          patientId: 'RAY-2026-' + Math.floor(100 + Math.random() * 900),
          name: pName,
          email: `${pName.toLowerCase().replace(/\s+/g, '')}@patient.in`,
          phone: pPhone || 'N/A',
          dosha: 'Vata-Pitta',
          preferredBranch: appt.branch || 'Kangra Centre',
          primaryCondition: appt.treatment || 'Ayurvedic Care',
          createdAt: appt.createdAt || new Date()
        });
      }
    }

    const patientsList = Array.from(patientMap.values());

    return res.json({
      success: true,
      count: patientsList.length,
      patients: patientsList
    });
  } catch (error) {
    console.error('getAllPatients error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/patients/:id — Single patient details
exports.getPatientById = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }
    return res.json({ success: true, patient });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/patients/:id — Remove patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await User.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }
    return res.json({ success: true, message: 'Patient record deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
