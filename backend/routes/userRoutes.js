const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register Endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user - password will be hashed by pre-save middleware
        const user = new User({
            name,
            email,
            password,  // This will be hashed automatically
            role: role || 'tenant',
            accountStatus: 'active'  // Allow immediate login
        });

        await user.save();

        // Generate JWT Token for auto-login
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check account status
        if (user.accountStatus !== 'active') {
            return res.status(401).json({ message: "Account is not active. Please verify your email." });
        }

        // Compare password using the schema method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
