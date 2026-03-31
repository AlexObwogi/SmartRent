const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000
    },
    landlordResponse: {
        type: String,
        maxlength: 500
    },
    date: {
        type: Date,
        default: Date.now
    },
    responseDate: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    helpful: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reviewSchema.index({ tenant: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
