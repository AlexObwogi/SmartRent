const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Frontend sends "name", we store as "name" (simpler)
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true,
        trim: true
    },
    // Store as "password" (simpler), but we hash it
    password: { 
        type: String, 
        required: [true, 'Password is required']
    },
    role: { 
        type: String, 
        enum: ['tenant', 'landlord', 'admin'], 
        default: 'tenant' 
    },
    phone: { 
        type: String,
        trim: true,
        default: ''
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    accountStatus: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'active'  // Change to 'active' for immediate login
    }
}, { 
    timestamps: true 
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
