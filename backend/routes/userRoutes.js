const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Day 2: Register Endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, role });
        res.status(201).json({ message: "User registered successfully", userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Day 3: Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;