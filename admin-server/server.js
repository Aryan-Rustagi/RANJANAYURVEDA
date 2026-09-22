const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    process.env.ADMIN_CLIENT_URL || 'http://localhost:5174',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' }
});

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'Ranjan Ayurveda Admin API Server',
    port: PORT,
    version: '1.0.0'
  });
});

// Admin API Routes
app.use('/api/admin/auth', authLimiter, require('./routes/adminAuthRoutes'));
app.use('/api/admin/patients', require('./routes/adminPatientsRoutes'));
app.use('/api/admin/appointments', require('./routes/adminAppointmentsRoutes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Admin API endpoint '${req.originalUrl}' not found.` });
});

app.use((err, req, res, next) => {
  console.error('Admin Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🛡️  Admin Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
});
