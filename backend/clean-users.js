const mongoose = require('mongoose');
require('dotenv').config();

async function cleanUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        
        // Delete all users
        const result = await User.deleteMany({});
        console.log(Deleted  users);
        
        // Create an admin user
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin123!', salt);
        
        const admin = new User({
            name: 'System Administrator',
            email: 'admin@smartrent.com',
            password: hashedPassword,
            role: 'admin',
            accountStatus: 'active'
        });
        
        await admin.save();
        console.log('✅ Admin user created: admin@smartrent.com / Admin123!');
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

cleanUsers();
