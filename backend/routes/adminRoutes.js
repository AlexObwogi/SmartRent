const express = require('express');
const router = express.Router();
const User = require('../models/User');
const House = require('../models/House');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const auth = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all properties
router.get('/properties', auth, isAdmin, async (req, res) => {
    try {
        const properties = await House.find().populate('landlord', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve property
router.put('/properties/:id/approve', auth, isAdmin, async (req, res) => {
    try {
        const property = await House.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );
        res.json({ message: 'Property approved', property });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reject property
router.delete('/properties/:id/reject', auth, isAdmin, async (req, res) => {
    try {
        await House.findByIdAndDelete(req.params.id);
        res.json({ message: 'Property rejected and deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bookings
router.get('/bookings', auth, isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('tenant', 'name email')
            .populate('property', 'title');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all payments
router.get('/payments', auth, isAdmin, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('tenant', 'name email')
            .populate('property', 'title');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get dashboard stats
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            totalProperties: await House.countDocuments(),
            totalBookings: await Booking.countDocuments(),
            totalPayments: await Payment.countDocuments(),
            totalReviews: await Review.countDocuments(),
            pendingProperties: await House.countDocuments({ isVerified: false }),
            landlords: await User.countDocuments({ role: 'landlord' }),
            tenants: await User.countDocuments({ role: 'tenant' })
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;