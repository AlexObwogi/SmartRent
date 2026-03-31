const express = require('express');
const router = express.Router();
const Saved = require('../models/Saved');
const auth = require('../middleware/authMiddleware');

// Get user's saved properties
router.get('/', auth, async (req, res) => {
    try {
        const saved = await Saved.find({ user: req.user.id })
            .populate('property')
            .sort({ createdAt: -1 });
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save a property
router.post('/', auth, async (req, res) => {
    try {
        const { propertyId } = req.body;
        
        // Check if already saved
        const existing = await Saved.findOne({ user: req.user.id, property: propertyId });
        if (existing) {
            return res.status(400).json({ message: 'Property already saved' });
        }
        
        const saved = new Saved({
            user: req.user.id,
            property: propertyId
        });
        
        await saved.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove saved property
router.delete('/:propertyId', auth, async (req, res) => {
    try {
        const saved = await Saved.findOneAndDelete({
            user: req.user.id,
            property: req.params.propertyId
        });
        
        if (!saved) {
            return res.status(404).json({ message: 'Saved property not found' });
        }
        
        res.json({ message: 'Property removed from saved list' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
