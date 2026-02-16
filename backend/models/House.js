const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    
    // GIS Integration: This follows GeoJSON format for Google Maps
    location: {
        type: {
            type: String, 
            enum: ['Point'], // Must be 'Point'
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },

    // Media for AI & Computer Vision
    images: [{ type: String }], // Array of Cloudinary links
    videoTour: { type: String }, // Link to video file
    
    // AI Insights (Landlord specific)
    isVerified: { type: Boolean, default: false },
    amenities: [String], // e.g., ["WiFi", "Parking", "Water"]
    
    createdAt: { type: Date, default: Date.now }
});

// This line allows us to do "Nearby Search" later using GIS
HouseSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('House', HouseSchema);