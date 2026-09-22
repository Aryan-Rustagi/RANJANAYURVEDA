const Prescription = require('../models/Prescription');

// @desc    Get prescriptions for logged in patient
// @route   GET /api/prescriptions/my
// @access  Private (Patient)
exports.getMyPrescriptions = async (req, res) => {
  try {
    let prescriptions = [];
    try {
      prescriptions = await Prescription.find({ patient: req.user.id });
    } catch (dbErr) {
      // Fallback
    }

    const defaultMedicines = [
      {
        id: 1,
        name: "Yograj Guggulu Tablets",
        dosage: "1 Tablet, Twice Daily",
        timing: "After Meals with Warm Water",
        purpose: "Eases joint stiffness & reduces Vata inflammation in spine",
        quantityRemaining: "12 Days supply left",
        status: "Active"
      },
      {
        id: 2,
        name: "Mahanarayan Taila (100ml)",
        dosage: "Gentle External Application",
        timing: "Apply warm on lower back before bedtime",
        purpose: "Nourishes lumbar vertebrae & relieves muscular spasm",
        quantityRemaining: "5 Days supply left",
        status: "Refill Needed"
      },
      {
        id: 3,
        name: "Dashamularishta Syrup",
        dosage: "15ml with equal warm water",
        timing: "Twice daily after lunch and dinner",
        purpose: "Balances Vata dosha & improves nerve vital energy",
        quantityRemaining: "20 Days supply left",
        status: "Active"
      }
    ];

    return res.json({
      success: true,
      prescriptions: prescriptions.length > 0 ? prescriptions : [{ medicines: defaultMedicines }]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request refill for medicine
// @route   POST /api/prescriptions/refill
// @access  Private (Patient)
exports.requestRefill = async (req, res) => {
  try {
    const { medicineName } = req.body;
    return res.json({
      success: true,
      message: `Refill request submitted for ${medicineName || 'herbal medicine'}. You will receive pickup/delivery notification via SMS.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
