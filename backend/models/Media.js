const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', '360_tour'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    isPrimary: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    fileSize: {
        type: Number
    },
    mimeType: {
        type: String
    },
    metadata: {
        type: Map,
        of: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    }
});

// Indexes for faster queries
mediaSchema.index({ property: 1 });
mediaSchema.index({ landlord: 1 });
mediaSchema.index({ mediaType: 1 });
mediaSchema.index({ status: 1 });

module.exports = mongoose.model('Media', mediaSchema);
