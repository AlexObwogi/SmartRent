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
        
        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123!', salt);
        
        // Create admin
        const admin = new User({
            name: 'System Administrator',
            email: 'admin@smartrent.com',
            password: hashedPassword,
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
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

createAdmin();
