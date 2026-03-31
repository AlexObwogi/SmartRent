const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const House = require('../models/House');
const auth = require('../middleware/authMiddleware');

// Get landlord's applications
router.get('/landlord-applications', auth, async (req, res) => {
    try {
        // Only landlords can access
        if (req.user.role !== 'landlord') {
            return res.status(403).json({ message: 'Only landlords can view applications' });
        }
        
        // Find all properties owned by this landlord
        const properties = await House.find({ landlord: req.user.id });
        const propertyIds = properties.map(p => p._id);
        
        // Find all bookings for these properties
        const applications = await Booking.find({ property: { $in: propertyIds } })
            .populate('tenant', 'name email phone')
            .populate('property', 'title address price');
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching landlord applications:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update application status
router.put('/applications/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        const booking = await Booking.findById(req.params.id).populate('property');
        if (!booking) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // Check if property belongs to this landlord
        const house = await House.findById(booking.property);
        if (house.landlord.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        booking.status = status;
        await booking.save();
        
        res.json({ message: `Application ${status}`, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;