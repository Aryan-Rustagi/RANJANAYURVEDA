const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  branch: { type: String, required: true, enum: ['Kangra Centre', 'Dharamshala Centre', 'Kangra', 'Dharamshala'] },
  treatment: { type: String, required: true },
  doctorName: { type: String, default: 'Dr. Ranjan Sharma' },
  appointmentDate: { type: String, required: true },
  timeSlot: { type: String, default: '10:30 AM' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  type: { type: String, enum: ['OPD Consultation', 'Panchakarma Therapy', 'Nadi Pariksha'], default: 'OPD Consultation' },
  instructions: { type: String, default: 'Please arrive 10 minutes prior to your scheduled consultation time.' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
