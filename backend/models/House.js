const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [{ type: String }],
    videoTour: { type: String },
    isVerified: { type: Boolean, default: false },
    amenities: [String],
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    status: { 
        type: String, 
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// NO pre-save middleware to avoid the error
HouseSchema.index({ location: "2dsphere" });
HouseSchema.index({ landlord: 1 });

module.exports = mongoose.model('House', HouseSchema);
