const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['patient', 'admin', 'doctor'], default: 'patient' },
  patientId: { type: String, unique: true, sparse: true },
  dosha: { type: String, default: 'Not Assessed' },
  preferredBranch: { type: String, default: 'Kangra Centre' },
  primaryCondition: { type: String, default: 'General Consultation' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  if (!this.patientId) {
    this.patientId = 'RAY-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
