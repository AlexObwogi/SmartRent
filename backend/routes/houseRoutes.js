const express = require('express');
const router = express.Router();
const House = require('../models/House');
const auth = require('../middleware/authMiddleware');

// Get my properties (for landlord)
router.get('/my-properties', auth, async (req, res) => {
    try {
        if (req.user.role !== 'landlord') {
            return res.status(403).json({ message: 'Only landlords can view their properties' });
        }
        
        const properties = await House.find({ landlord: req.user.id });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all houses (public)
router.get('/', async (req, res) => {
    try {
        const houses = await House.find().populate('landlord', 'name email');
        res.json(houses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single house
router.get('/:id', async (req, res) => {
    try {
        const house = await House.findById(req.params.id).populate('landlord', 'name email');
        if (!house) {
            return res.status(404).json({ message: 'House not found' });
        }
        res.json(house);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create house (landlord only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'landlord') {
            return res.status(403).json({ message: 'Only landlords can create properties' });
        }
        
        const newHouse = new House({
            ...req.body,
            landlord: req.user.id
        });
        const savedHouse = await newHouse.save();
        res.status(201).json(savedHouse);
    } catch (err) {
        res.status(400).json({ message: "Error saving house", error: err.message });
    }
});

// Update house (landlord only)
router.put('/:id', auth, async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if (!house) {
            return res.status(404).json({ message: 'House not found' });
        }
        if (house.landlord.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedHouse);
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
});

// Delete house (landlord only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if (!house) {
            return res.status(404).json({ message: 'House not found' });
        }
        if (house.landlord.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await House.findByIdAndDelete(req.params.id);
        res.json({ message: "Property deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
