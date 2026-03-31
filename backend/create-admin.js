const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        
        const existing = await User.findOne({ email: 'admin@smartrent.com' });
        if (existing) {
            console.log('Admin already exists');
            console.log('Email: admin@smartrent.com');
            console.log('Password: Admin123!');
            await mongoose.disconnect();
            return;
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123!', salt);
        
        const admin = new User({
            name: 'System Administrator',
            email: 'admin@smartrent.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });
        
        await admin.save();
        console.log('✅ Admin user created!');
        console.log('Email: admin@smartrent.com');
        console.log('Password: Admin123!');
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

createAdmin();
