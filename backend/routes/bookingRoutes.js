const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/authMiddleware');

// Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      tenant: req.user.id
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate('property', 'title location price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for a property (landlord)
router.get('/property/:propertyId', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ property: req.params.propertyId })
      .populate('tenant', 'name email phone');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
