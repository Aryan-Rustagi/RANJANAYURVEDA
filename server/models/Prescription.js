const mongoose = require('mongoose');

const medicineItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timing: { type: String, required: true },
  purpose: { type: String, required: true },
  quantityRemaining: { type: String, default: '14 Days supply left' },
  status: { type: String, enum: ['Active', 'Refill Needed', 'Completed'], default: 'Active' }
});

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    default: 'Dr. Ranjan Sharma'
  },
  medicines: [medicineItemSchema],
  dietaryNotes: {
    type: String,
    default: 'Favor warm cooked meals with Ghee. Avoid cold drinks and spicy fried items.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
