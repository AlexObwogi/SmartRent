const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        
        // Remove existing admin if any
        await User.deleteOne({ email: 'admin@smartrent.com' });
        console.log('Removed existing admin if any');
        
        // Create admin - password will be hashed by pre-save middleware
        const admin = new User({
            name: 'System Administrator',
            email: 'admin@smartrent.com',
            password: 'Admin123!',
            role: 'admin',
            isVerified: true,
            phone: '+254700000000'
        });
        
        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@smartrent.com');
        console.log('Password: Admin123!');
        
        // Verify
        const verify = await User.findOne({ email: 'admin@smartrent.com' });
        if (verify) {
            console.log('Verified: Admin exists');
            console.log('Role:', verify.role);
            console.log('Password hash exists:', !!verify.password);
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

createAdmin();
