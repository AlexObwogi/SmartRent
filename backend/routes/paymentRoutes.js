const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/authMiddleware');

// Create payment
router.post('/', auth, async (req, res) => {
  try {
    const payment = new Payment({
      ...req.body,
      tenant: req.user.id
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's payments
router.get('/my-payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ tenant: req.user.id })
      .populate('property', 'title location');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get property payment history (landlord)
router.get('/property/:propertyId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ property: req.params.propertyId })
      .populate('tenant', 'name email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
