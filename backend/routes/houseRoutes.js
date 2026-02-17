const express = require('express');
const router = express.Router();
const House = require('../models/House'); // Import the Schema we made

// POST: Create a new house listing
router.post('/add', async (req, res) => {
    try {
        const newHouse = new House(req.body);
        const savedHouse = await newHouse.save();
        res.status(201).json(savedHouse);
    } catch (err) {
        res.status(400).json({ message: "Error saving house", error: err.message });
    }
});
// GET all houses (with optional filters)
router.get('/all', async (req, res) => {
    try {
        const { minPrice, maxPrice, type, city } = req.query;
        let query = {};

        // Day 5 Requirement: Search filters
        if (minPrice || maxPrice) {
            query.price = { 
                $gte: minPrice || 0, 
                $lte: maxPrice || Infinity 
            };
        }
        if (type) query.houseType = type;
        if (city) query.address = { $regex: city, $options: 'i' }; // Case-insensitive search

        const houses = await House.find(query).sort({ createdAt: -1 });
        res.status(200).json(houses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET: View all houses
router.get('/all', async (req, res) => {
    try {
        const houses = await House.find();
        res.status(200).json(houses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DAY 5: Update a property
router.put('/:id', async (req, res) => {
    try {
        const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedHouse);
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
});

// DAY 5: Delete a property
router.delete('/:id', async (req, res) => {
    try {
        await House.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// UPDATE a house
router.put('/:id', async (req, res) => {
    try {
        const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedHouse);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a house
router.delete('/:id', async (req, res) => {
    try {
        await House.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;