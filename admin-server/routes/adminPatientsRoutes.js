const express = require('express');
const router = express.Router();
const { getAllPatients, getPatientById, deletePatient } = require('../controllers/adminPatientsController');
const { adminProtect } = require('../middleware/adminAuth');

router.get('/', adminProtect, getAllPatients);
router.get('/:id', adminProtect, getPatientById);
router.delete('/:id', adminProtect, deletePatient);

module.exports = router;
